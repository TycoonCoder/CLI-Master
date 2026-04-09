import type { CommandResult, VirtualFileSystemState } from './types';

export class CLISimulator {
  private fileSystem: Record<string, any> = {};
  private currentPath: string = '/home/user';
  private environment: Record<string, string> = { USER: 'user' };

  constructor() {
    this.initializeFileSystem();
  }

  private initializeFileSystem() {
    this.fileSystem = {
      '/home/user': {
        type: 'directory',
        contents: ['documents', 'downloads', 'Desktop', 'file.txt', 'notes.md']
      },
      '/home/user/documents': {
        type: 'directory',
        contents: ['work', 'personal']
      },
      '/home/user/downloads': {
        type: 'directory',
        contents: ['file.zip']
      },
      '/home/user/Desktop': {
        type: 'directory',
        contents: []
      },
      '/home/user/file.txt': {
        type: 'file',
        content: 'Hello World!\nThis is a test file.'
      },
      '/home/user/notes.md': {
        type: 'file',
        content: '# My Notes\n\nImportant stuff here.'
      },
      '/home/user/documents/work': {
        type: 'directory',
        contents: ['project.txt']
      },
      '/home/user/documents/personal': {
        type: 'directory',
        contents: ['diary.txt']
      },
      '/home/user/documents/work/project.txt': {
        type: 'file',
        content: 'Project documentation'
      },
      '/home/user/documents/personal/diary.txt': {
        type: 'file',
        content: 'Dear diary...'
      },
      '/home/user/downloads/file.zip': {
        type: 'file',
        content: 'Compressed file'
      },
      '/var/log': {
        type: 'directory',
        contents: ['system.log', 'auth.log']
      },
      '/var/log/system.log': {
        type: 'file',
        content: 'System logs...'
      },
      '/var/log/auth.log': {
        type: 'file',
        content: 'Authentication logs...'
      },
      '/usr': {
        type: 'directory',
        contents: ['bin']
      },
      '/usr/bin': {
        type: 'directory',
        contents: ['bash', 'ls', 'cd', 'cat', 'echo', 'mkdir', 'touch', 'clear']
      },
      '/tmp': {
        type: 'directory',
        contents: []
      },
      '/var': {
        type: 'directory',
        contents: ['log']
      }
    };
  }

  executeCommand(command: string): CommandResult {
    const trimmed = command.trim();
    
    // Handle empty command
    if (!trimmed) {
      return {
        success: true,
        output: '',
        exitCode: 0
      };
    }

    // Handle teaching messages (commands like 'continue' to advance)
    if (trimmed === 'continue') {
      return {
        success: true,
        output: 'Continuing to next challenge...',
        exitCode: 0
      };
    }

    const parts = trimmed.split(' ');
    const baseCmd = parts[0];
    const args = parts.slice(1);

    try {
      let output = '';
      let success = true;
      let exitCode = 0;

      switch (baseCmd) {
        case 'pwd':
          output = this.currentPath + '\n';
          break;

        case 'ls':
          const dir = this.fileSystem[this.currentPath];
          if (dir?.type === 'directory') {
            output = dir.contents.join('  ') + '\n';
          } else {
            output = 'ls: cannot access directory\n';
            success = false;
            exitCode = 1;
          }
          break;

        case 'cd':
          if (args.length === 0) {
            this.currentPath = '/home/user';
            output = '';
          } else {
            const target = args[0];
            let newPath = '';
            
            if (target === '..') {
              const parts = this.currentPath.split('/').slice(0, -1);
              newPath = parts.length > 1 ? parts.join('/') : '/';
            } else if (target === '~' || target === '$HOME') {
              newPath = '/home/user';
            } else if (target.startsWith('/')) {
              newPath = target;
            } else if (target === '.') {
              newPath = this.currentPath; // Stay in current directory
            } else {
              newPath = `${this.currentPath}/${target}`;
            }
            
            // Check if directory exists (create it for learning purposes if needed)
            if (!this.fileSystem[newPath]) {
              // For educational purposes, create the directory if parent exists
              const parentPath = newPath.split('/').slice(0, -1).join('/') || '/';
              if (this.fileSystem[parentPath]?.type === 'directory') {
                this.fileSystem[newPath] = { type: 'directory', contents: [] };
                const dirName = newPath.split('/').pop() || '';
                this.fileSystem[parentPath].contents.push(dirName);
              }
            }
            
            if (this.fileSystem[newPath]?.type === 'directory') {
              this.currentPath = newPath;
              output = '';
            } else {
              output = `cd: ${target}: No such file or directory\n`;
              success = false;
              exitCode = 1;
            }
          }
          break;

        case 'cat':
          if (args.length === 0) {
            output = 'cat: missing file operand\n';
            success = false;
            exitCode = 1;
          } else {
            const filePath = `${this.currentPath}/${args[0]}`;
            const file = this.fileSystem[filePath];
            if (file?.type === 'file') {
              output = file.content + '\n';
            } else {
              output = `cat: ${args[0]}: No such file or directory\n`;
              success = false;
              exitCode = 1;
            }
          }
          break;

        case 'echo':
          output = args.join(' ') + '\n';
          break;

        case 'mkdir':
          if (args.length === 0) {
            output = 'mkdir: missing operand\n';
            success = false;
            exitCode = 1;
          } else {
            // Handle mkdir -p (create parent directories)
            const createParents = args.includes('-p');
            const dirs = createParents ? args.filter(arg => arg !== '-p') : args;
            
            dirs.forEach(newDir => {
              const newPath = `${this.currentPath}/${newDir}`;
              
              // Create directory
              this.fileSystem[newPath] = { type: 'directory', contents: [] };
              
              // Add to parent directory
              const parent = this.fileSystem[this.currentPath];
              if (parent?.type === 'directory') {
                parent.contents.push(newDir);
              }
            });
            
            output = '';
          }
          break;

        case 'touch':
          if (args.length === 0) {
            output = 'touch: missing file operand\n';
            success = false;
            exitCode = 1;
          } else {
            const newFile = args[0];
            const newPath = `${this.currentPath}/${newFile}`;
            
            // Create file
            this.fileSystem[newPath] = { type: 'file', content: '' };
            
            // Add to parent directory
            const parent = this.fileSystem[this.currentPath];
            if (parent?.type === 'directory') {
              parent.contents.push(newFile);
            }
            
            output = '';
          }
          break;

        case 'clear':
          output = '\x1b[2J\x1b[3J\x1b[H'; // ANSI clear screen
          break;

        case 'grep':
          if (args.length < 2) {
            output = 'grep: missing pattern or file\n';
            success = false;
            exitCode = 1;
          } else {
            const pattern = args[0];
            const filename = args[1];
            const filePath = `${this.currentPath}/${filename}`;
            const file = this.fileSystem[filePath];
            
            if (file?.type === 'file') {
              const lines = file.content.split('\n');
              const caseInsensitive = args.includes('-i');
              const countOnly = args.includes('-c');
              
              let matches: string[] = [];
              let matchCount = 0;
              
              const searchPattern = caseInsensitive ? pattern.toLowerCase() : pattern;
              
              for (const line of lines) {
                const searchLine = caseInsensitive ? line.toLowerCase() : line;
                if (searchLine.includes(searchPattern)) {
                  matches.push(line);
                  matchCount++;
                }
              }
              
              if (countOnly) {
                output = `${matchCount}\n`;
              } else {
                output = matches.join('\n') + (matches.length > 0 ? '\n' : '');
              }
            } else {
              output = `grep: ${filename}: No such file or directory\n`;
              success = false;
              exitCode = 1;
            }
          }
          break;

        case 'find':
          if (args.length < 1) {
            output = 'find: missing directory path\n';
            success = false;
            exitCode = 1;
          } else {
            const startPath = args[0] === '.' ? this.currentPath : args[0];
            const namePattern = this.extractFindPattern(args, '-name');
            const typeFilter = this.extractFindPattern(args, '-type');
            const mtimeDays = this.extractFindMtime(args);
            
            const results = this.findFiles(startPath, {
              namePattern,
              typeFilter,
              mtimeDays
            });
            
            output = results.join('\n') + (results.length > 0 ? '\n' : '');
          }
          break;

        case 'sed':
          if (args.length < 3) {
            output = 'sed: missing expression or file\n';
            success = false;
            exitCode = 1;
          } else {
            const expression = args[0];
            const filename = args[1];
            const filePath = `${this.currentPath}/${filename}`;
            const file = this.fileSystem[filePath];
            
            if (file?.type === 'file') {
              let content = file.content;
              
              // Handle s/old/new/ substitution
              if (expression.startsWith('s/') && expression.includes('/')) {
                const parts = expression.split('/');
                if (parts.length >= 3) {
                  const oldPattern = parts[1];
                  const newPattern = parts[2];
                  content = content.replace(new RegExp(oldPattern, 'g'), newPattern);
                }
              }
              // Handle /pattern/d deletion
              else if (expression.endsWith('/d')) {
                const pattern = expression.slice(1, -2);
                const lines = content.split('\n');
                const filteredLines = lines.filter((line: string) => !line.includes(pattern));
                content = filteredLines.join('\n');
              }
              
              output = content + '\n';
            } else {
              output = `sed: ${filename}: No such file or directory\n`;
              success = false;
              exitCode = 1;
            }
          }
          break;

        case 'awk':
          if (args.length < 2) {
            output = 'awk: missing program or file\n';
            success = false;
            exitCode = 1;
          } else {
            const program = args[0];
            const filename = args[1];
            const filePath = `${this.currentPath}/${filename}`;
            const file = this.fileSystem[filePath];
            
            if (file?.type === 'file') {
              const lines = file.content.split('\n');
              let fieldSeparator = ' ';
              if (args.includes('-F')) {
                const fsIndex = args.indexOf('-F');
                if (fsIndex + 1 < args.length) {
                  fieldSeparator = args[fsIndex + 1].replace(/["']/g, '');
                }
              }
              
              const results: string[] = [];
              
              for (const line of lines) {
                const fields = line.split(fieldSeparator);
                
                // Simple awk program parsing for {print $N}
                if (program.includes('print $')) {
                  const fieldMatch = program.match(/\$(\d+)/);
                  if (fieldMatch) {
                    const fieldNum = parseInt(fieldMatch[1]);
                    if (fieldNum > 0 && fieldNum <= fields.length) {
                      results.push(fields[fieldNum - 1]);
                    }
                  }
                }
                // Handle conditions like $2 > 27 {print $1}
                else if (program.includes('>') && program.includes('{print $')) {
                  const conditionMatch = program.match(/\$(\d+) > (\d+)/);
                  const printMatch = program.match(/\{print \$(\d+)\}/);
                  
                  if (conditionMatch && printMatch) {
                    const conditionField = parseInt(conditionMatch[1]);
                    const threshold = parseInt(conditionMatch[2]);
                    const printField = parseInt(printMatch[1]);
                    
                    if (conditionField > 0 && conditionField <= fields.length) {
                      const value = parseInt(fields[conditionField - 1]);
                      if (!isNaN(value) && value > threshold) {
                        results.push(fields[printField - 1]);
                      }
                    }
                  }
                }
              }
              
              output = results.join('\n') + (results.length > 0 ? '\n' : '');
            } else {
              output = `awk: ${filename}: No such file or directory\n`;
              success = false;
              exitCode = 1;
            }
          }
          break;

        case '&&':
          // Handle command chains
          const commands = trimmed.split('&&').map(cmd => cmd.trim());
          for (const cmd of commands) {
            const result = this.executeCommand(cmd);
            output += result.output;
            if (!result.success) {
              success = false;
              exitCode = result.exitCode;
              break;
            }
          }
          break;

        case '>':
          // Handle output redirection (simplified)
          if (args.length < 2) {
            output = 'Syntax error: echo "text" > filename\n';
            success = false;
            exitCode = 1;
          } else {
            const content = args.slice(0, -1).join(' ');
            const filename = args[args.length - 1];
            const filePath = `${this.currentPath}/${filename}`;
            
            // Create or overwrite file
            this.fileSystem[filePath] = { type: 'file', content };
            
            // Add to parent directory if not already there
            const parent = this.fileSystem[this.currentPath];
            if (parent?.type === 'directory' && !parent.contents.includes(filename)) {
              parent.contents.push(filename);
            }
            
            output = '';
          }
          break;

        case 'ls':
          const currentDir = this.fileSystem[this.currentPath];
          if (currentDir?.type === 'directory') {
            // Handle ls -R (recursive)
            if (args.includes('-R')) {
              output = this.listRecursive(this.currentPath, 0);
            } else {
              output = currentDir.contents.join('  ') + '\n';
            }
          } else {
            output = 'ls: cannot access directory\n';
            success = false;
            exitCode = 1;
          }
          break;

        default:
          output = `Command not found: ${baseCmd}. Type 'help' for available commands.\n`;
          success = false;
          exitCode = 127;
      }

      return { success, output, exitCode };
    } catch (error) {
      return {
        success: false,
        output: `Error: ${error}\n`,
        error: String(error),
        exitCode: 1
      };
    }
  }

  getCurrentState(): VirtualFileSystemState {
    const files: any[] = [];
    const directories: any[] = [];
    
    const dir = this.fileSystem[this.currentPath];
    if (dir?.type === 'directory') {
      dir.contents.forEach((item: string) => {
        const path = `${this.currentPath}/${item}`;
        const entry = this.fileSystem[path];
        if (entry) {
          if (entry.type === 'file') {
            files.push({
              name: item,
              content: entry.content,
              permissions: 'rw-r--r--',
              owner: 'user',
              group: 'users'
            });
          } else if (entry.type === 'directory') {
            directories.push({
              name: item,
              permissions: 'rwxr-xr-x',
              owner: 'user',
              group: 'users'
            });
          }
        }
      });
    }

    return {
      currentPath: this.currentPath,
      files,
      directories,
      environment: this.environment
    };
  }

  setFileSystemState(state: VirtualFileSystemState) {
    this.currentPath = state.currentPath;
    this.environment = state.environment;
    
    // Rebuild file system from state
    const newFileSystem: Record<string, any> = {};
    
    // Add directories
    state.directories.forEach(dirItem => {
      const path = `${this.currentPath}/${dirItem.name}`;
      newFileSystem[path] = { type: 'directory', contents: [] };
    });
    
    // Add files
    state.files.forEach(fileItem => {
      const path = `${this.currentPath}/${fileItem.name}`;
      newFileSystem[path] = { type: 'file', content: fileItem.content };
    });
    
    // Merge with existing file system
    this.fileSystem = { ...this.fileSystem, ...newFileSystem };
  }

  private listRecursive(path: string, depth: number): string {
    const dir = this.fileSystem[path];
    if (!dir || dir.type !== 'directory') return '';
    
    let result = '';
    const indent = '  '.repeat(depth);
    
    dir.contents.forEach((item: string) => {
      const itemPath = `${path}/${item}`;
      const itemEntry = this.fileSystem[itemPath];
      
      if (itemEntry?.type === 'directory') {
        result += `${indent}${item}/\n`;
        result += this.listRecursive(itemPath, depth + 1);
      } else {
        result += `${indent}${item}\n`;
      }
    });
    
    return result;
  }

  private extractFindPattern(args: string[], option: string): string | null {
    const index = args.indexOf(option);
    if (index !== -1 && index + 1 < args.length) {
      return args[index + 1].replace(/["']/g, '');
    }
    return null;
  }

  private extractFindMtime(args: string[]): number | null {
    const index = args.indexOf('-mtime');
    if (index !== -1 && index + 1 < args.length) {
      const value = args[index + 1];
      if (value.startsWith('-')) {
        return -parseInt(value.slice(1));
      }
    }
    return null;
  }

  private findFiles(startPath: string, options: {
    namePattern?: string | null;
    typeFilter?: string | null;
    mtimeDays?: number | null;
  }): string[] {
    const results: string[] = [];
    
    const traverse = (path: string) => {
      const entry = this.fileSystem[path];
      if (!entry) return;
      
      if (entry.type === 'directory') {
        // Check if directory matches criteria
        if (options.typeFilter === 'd' && this.matchesFindCriteria(path, entry, options)) {
          results.push(path);
        }
        
        // Recurse into contents
        entry.contents.forEach((item: string) => {
          const itemPath = `${path}/${item}`;
          traverse(itemPath);
        });
      } else if (entry.type === 'file') {
        if (this.matchesFindCriteria(path, entry, options)) {
          results.push(path);
        }
      }
    };
    
    traverse(startPath);
    return results;
  }

  private matchesFindCriteria(path: string, entry: any, options: {
    namePattern?: string | null;
    typeFilter?: string | null;
    mtimeDays?: number | null;
  }): boolean {
    const fileName = path.split('/').pop() || '';
    
    // Check type filter
    if (options.typeFilter) {
      if (options.typeFilter === 'd' && entry.type !== 'directory') return false;
      if (options.typeFilter === 'f' && entry.type !== 'file') return false;
    }
    
    // Check name pattern
    if (options.namePattern) {
      const pattern = options.namePattern.replace('*', '.*');
      const regex = new RegExp(`^${pattern}$`);
      if (!regex.test(fileName)) return false;
    }
    
    // Note: mtimeDays simulation is simplified
    if (options.mtimeDays !== null && options.mtimeDays !== undefined) {
      // Simulate recent files for educational purposes
      const isRecent = Math.random() > 0.5; // Simplified for demo
      if (options.mtimeDays < 0 && !isRecent) return false; // Modified within last N days
    }
    
    return true;
  }
}