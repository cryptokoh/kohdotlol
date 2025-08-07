// Command Processing Engine for koH Labs Terminal
// Handles parsing, validation, and execution of terminal commands

import { WebSocket } from 'ws';
import { User, CommandHistory } from '../types/database';
import { SolanaService } from './SolanaService';
import { AIService } from './AIService';
import { DataService } from './DataService';

export interface CommandContext {
  user: User;
  sessionId: string;
  websocket?: WebSocket;
  dangerousModeEnabled: boolean;
  aiModeEnabled: boolean;
}

export interface CommandResult {
  success: boolean;
  output: string;
  executionTime: number;
  data?: any;
  error?: string;
  requiresConfirmation?: boolean;
  dangerousCommand?: boolean;
}

export interface ParsedCommand {
  command: string;
  subcommand?: string;
  arguments: string[];
  flags: Record<string, string | boolean>;
  rawInput: string;
}

export class CommandProcessor {
  private solanaService: SolanaService;
  private aiService: AIService;
  private dataService: DataService;
  private commandRegistry: Map<string, CommandHandler> = new Map();

  constructor() {
    this.solanaService = new SolanaService();
    this.aiService = new AIService();
    this.dataService = new DataService();
    this.initializeCommands();
  }

  // ============================================================================
  // COMMAND PARSING
  // ============================================================================

  parseCommand(input: string): ParsedCommand {
    const trimmed = input.trim();
    const parts = this.smartSplit(trimmed);
    const [command, subcommand, ...rest] = parts;
    
    const { arguments: args, flags } = this.parseArgumentsAndFlags(rest);

    return {
      command: command?.toLowerCase() || '',
      subcommand: subcommand?.toLowerCase(),
      arguments: args,
      flags,
      rawInput: input
    };
  }

  private smartSplit(input: string): string[] {
    const parts: string[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const nextChar = input[i + 1];

      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = '';
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          parts.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current) {
      parts.push(current);
    }

    return parts;
  }

  private parseArgumentsAndFlags(parts: string[]): { arguments: string[]; flags: Record<string, string | boolean> } {
    const arguments: string[] = [];
    const flags: Record<string, string | boolean> = {};

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (part.startsWith('--')) {
        const flagName = part.substring(2);
        const nextPart = parts[i + 1];
        
        if (nextPart && !nextPart.startsWith('-')) {
          flags[flagName] = nextPart;
          i++; // Skip next part as it's the flag value
        } else {
          flags[flagName] = true;
        }
      } else if (part.startsWith('-')) {
        const flagName = part.substring(1);
        flags[flagName] = true;
      } else {
        arguments.push(part);
      }
    }

    return { arguments, flags };
  }

  // ============================================================================
  // COMMAND VALIDATION
  // ============================================================================

  async validateCommand(parsed: ParsedCommand, context: CommandContext): Promise<{ valid: boolean; error?: string; warnings?: string[] }> {
    const handler = this.commandRegistry.get(parsed.command);
    
    if (!handler) {
      return { 
        valid: false, 
        error: `Unknown command: ${parsed.command}. Type 'help' for available commands.` 
      };
    }

    // Check permissions
    if (handler.requiredPermission > context.user.permission_level) {
      return { 
        valid: false, 
        error: `Insufficient permissions for command '${parsed.command}'. Required: ${handler.requiredPermission}, Current: ${context.user.permission_level}` 
      };
    }

    // Check dangerous mode for risky commands
    if (handler.dangerous && !context.dangerousModeEnabled) {
      return { 
        valid: false, 
        error: `Command '${parsed.command}' requires dangerous mode to be enabled. Use 'dangerous-mode on' to enable.` 
      };
    }

    // Validate arguments
    if (handler.minArgs && parsed.arguments.length < handler.minArgs) {
      return { 
        valid: false, 
        error: `Command '${parsed.command}' requires at least ${handler.minArgs} arguments. Got ${parsed.arguments.length}.` 
      };
    }

    if (handler.maxArgs && parsed.arguments.length > handler.maxArgs) {
      return { 
        valid: false, 
        error: `Command '${parsed.command}' accepts at most ${handler.maxArgs} arguments. Got ${parsed.arguments.length}.` 
      };
    }

    // Custom validation
    if (handler.validateArgs) {
      const validation = await handler.validateArgs(parsed, context);
      if (!validation.valid) {
        return validation;
      }
    }

    return { valid: true };
  }

  // ============================================================================
  // COMMAND EXECUTION
  // ============================================================================

  async executeCommand(parsed: ParsedCommand, context: CommandContext): Promise<CommandResult> {
    const startTime = Date.now();
    
    try {
      // Validate first
      const validation = await this.validateCommand(parsed, context);
      if (!validation.valid) {
        return {
          success: false,
          output: validation.error || 'Command validation failed',
          executionTime: Date.now() - startTime,
          error: validation.error
        };
      }

      const handler = this.commandRegistry.get(parsed.command);
      if (!handler) {
        throw new Error('Command handler not found after validation');
      }

      // Execute command
      const result = await handler.execute(parsed, context);
      
      // Log command execution
      await this.logCommandExecution(parsed, context, result, Date.now() - startTime);

      return {
        ...result,
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown execution error';
      
      // Log error
      await this.logCommandExecution(parsed, context, { 
        success: false, 
        output: errorMessage,
        executionTime: 0 
      }, Date.now() - startTime);

      return {
        success: false,
        output: `Error: ${errorMessage}`,
        executionTime: Date.now() - startTime,
        error: errorMessage
      };
    }
  }

  // ============================================================================
  // COMMAND HANDLERS INITIALIZATION
  // ============================================================================

  private initializeCommands() {
    // System commands
    this.registerCommand('help', new HelpCommand());
    this.registerCommand('clear', new ClearCommand());
    this.registerCommand('history', new HistoryCommand());
    this.registerCommand('whoami', new WhoAmICommand());
    this.registerCommand('dangerous-mode', new DangerousModeCommand());
    this.registerCommand('ai-mode', new AIModeCommand());

    // Token and DeFi commands
    this.registerCommand('token', new TokenCommand(this.solanaService, this.dataService));
    this.registerCommand('balance', new BalanceCommand(this.solanaService));
    this.registerCommand('price', new PriceCommand(this.dataService));
    this.registerCommand('swap', new SwapCommand(this.solanaService));
    this.registerCommand('watchlist', new WatchlistCommand(this.dataService));

    // Market data commands
    this.registerCommand('market', new MarketCommand(this.dataService));
    this.registerCommand('trending', new TrendingCommand(this.dataService));
    this.registerCommand('sentiment', new SentimentCommand(this.dataService));

    // AI-powered commands
    this.registerCommand('explain', new ExplainCommand(this.aiService));
    this.registerCommand('predict', new PredictCommand(this.aiService));
    this.registerCommand('analyze', new AnalyzeCommand(this.aiService, this.dataService));

    // Development and debug commands
    this.registerCommand('debug', new DebugCommand());
    this.registerCommand('system', new SystemCommand());
  }

  private registerCommand(name: string, handler: CommandHandler) {
    this.commandRegistry.set(name, handler);
  }

  // ============================================================================
  // AUTOCOMPLETE SYSTEM
  // ============================================================================

  getAutocompleteSuggestions(input: string, context: CommandContext): string[] {
    const trimmed = input.trim();
    const parts = trimmed.split(' ');
    
    if (parts.length === 1) {
      // Command completion
      const commandStart = parts[0].toLowerCase();
      return Array.from(this.commandRegistry.keys())
        .filter(cmd => cmd.startsWith(commandStart))
        .filter(cmd => {
          const handler = this.commandRegistry.get(cmd);
          return handler && handler.requiredPermission <= context.user.permission_level;
        })
        .sort();
    }

    // Subcommand and argument completion
    const [command, ...rest] = parts;
    const handler = this.commandRegistry.get(command.toLowerCase());
    
    if (handler && handler.getCompletions) {
      return handler.getCompletions(rest, context);
    }

    return [];
  }

  // ============================================================================
  // COMMAND HISTORY AND LOGGING
  // ============================================================================

  private async logCommandExecution(
    parsed: ParsedCommand, 
    context: CommandContext, 
    result: CommandResult, 
    executionTime: number
  ): Promise<void> {
    try {
      // Implementation would save to PostgreSQL
      console.log('Command executed:', {
        user: context.user.id,
        command: parsed.rawInput,
        success: result.success,
        executionTime,
        dangerous: result.dangerousCommand || false
      });
    } catch (error) {
      console.error('Failed to log command execution:', error);
    }
  }

  // ============================================================================
  // AI INTEGRATION
  // ============================================================================

  async getPredictedCommands(context: CommandContext, recentCommands: string[]): Promise<string[]> {
    if (!context.aiModeEnabled) {
      return [];
    }

    try {
      return await this.aiService.predictCommands(context.user, recentCommands);
    } catch (error) {
      console.error('AI prediction failed:', error);
      return [];
    }
  }
}

// ============================================================================
// COMMAND HANDLER INTERFACE
// ============================================================================

export interface CommandHandler {
  requiredPermission: number;
  dangerous: boolean;
  minArgs?: number;
  maxArgs?: number;
  description: string;
  usage: string;
  examples: string[];
  
  execute(parsed: ParsedCommand, context: CommandContext): Promise<CommandResult>;
  validateArgs?(parsed: ParsedCommand, context: CommandContext): Promise<{ valid: boolean; error?: string; warnings?: string[] }>;
  getCompletions?(args: string[], context: CommandContext): string[];
}

// ============================================================================
// SAMPLE COMMAND IMPLEMENTATIONS
// ============================================================================

class HelpCommand implements CommandHandler {
  requiredPermission = 0;
  dangerous = false;
  description = 'Show available commands and usage information';
  usage = 'help [command]';
  examples = ['help', 'help token', 'help swap'];

  async execute(parsed: ParsedCommand, context: CommandContext): Promise<CommandResult> {
    if (parsed.arguments.length > 0) {
      // Show help for specific command
      const commandName = parsed.arguments[0];
      // Implementation would fetch command details
      return {
        success: true,
        output: `Help for command: ${commandName}`,
        executionTime: 0
      };
    }

    // Show general help
    const helpText = `
koH Labs Terminal v1.0.0

Available Commands:
  help              - Show this help message
  clear             - Clear terminal screen
  token <address>   - Get token information
  balance [address] - Show wallet balance
  price <symbol>    - Get token price
  market            - Show market overview
  watchlist         - Manage token watchlist
  
Type 'help <command>' for detailed usage.
Type 'dangerous-mode on' to enable advanced commands.
    `;

    return {
      success: true,
      output: helpText.trim(),
      executionTime: 0
    };
  }
}

class TokenCommand implements CommandHandler {
  requiredPermission = 0;
  dangerous = false;
  minArgs = 1;
  description = 'Get detailed token information';
  usage = 'token <mint-address> [--json]';
  examples = ['token EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'];

  constructor(
    private solanaService: SolanaService,
    private dataService: DataService
  ) {}

  async execute(parsed: ParsedCommand, context: CommandContext): Promise<CommandResult> {
    const mintAddress = parsed.arguments[0];
    const jsonFormat = parsed.flags.json === true;

    try {
      const tokenInfo = await this.solanaService.getTokenInfo(mintAddress);
      const priceData = await this.dataService.getTokenPrice(mintAddress);

      if (jsonFormat) {
        return {
          success: true,
          output: JSON.stringify({ tokenInfo, priceData }, null, 2),
          executionTime: 0,
          data: { tokenInfo, priceData }
        };
      }

      const output = `
Token Information:
  Name: ${tokenInfo.name}
  Symbol: ${tokenInfo.symbol}
  Mint: ${mintAddress}
  Supply: ${tokenInfo.supply.toLocaleString()}
  Decimals: ${tokenInfo.decimals}
  
Current Price: $${priceData.price}
24h Change: ${priceData.change24h > 0 ? '+' : ''}${priceData.change24h.toFixed(2)}%
Market Cap: $${priceData.marketCap.toLocaleString()}
      `;

      return {
        success: true,
        output: output.trim(),
        executionTime: 0,
        data: { tokenInfo, priceData }
      };

    } catch (error) {
      return {
        success: false,
        output: `Failed to fetch token information: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getCompletions(args: string[], context: CommandContext): string[] {
    // Could return recent token addresses or popular tokens
    return ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v']; // USDC example
  }
}

export default CommandProcessor;