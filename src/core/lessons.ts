import type { Lesson } from './types';

export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Welcome to Terminal',
    description: 'Learn what a terminal is and how to use it',
    commands: ['pwd'],
    challenges: [
      {
        id: 'challenge-1',
        description: 'First, let\'s learn about the terminal. The terminal is a text-based interface to your computer. You type commands and see results.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-2',
        description: 'The command prompt shows your username and current location. Try typing "pwd" (Print Working Directory) to see where you are.',
        expectedCommand: 'pwd',
        hints: ['Type "pwd" and press Enter'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-3',
        description: 'Great! Now let\'s practice. What command would you use to find your current directory?',
        expectedCommand: 'pwd',
        hints: ['Remember: "pwd" shows your current location'],
        fileSystemState: {
          currentPath: '/home/user/documents',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-4',
        description: 'Excellent! Now navigate to your home directory using "cd ~" and confirm with pwd. You can chain commands with "&&".',
        expectedCommand: 'cd ~ && pwd',
        hints: ['Use "cd ~" to go to home directory', 'Chain commands: "cd ~ && pwd"', '"&&" runs commands sequentially'],
        fileSystemState: {
          currentPath: '/home/user/documents',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: [],
    xpReward: 40,
    visualAid: {
      type: 'command-flow',
      data: { 
        teachingPoints: [
          'Terminal = text interface to computer',
          'pwd = Print Working Directory',
          'Shows your current location in file system'
        ]
      }
    }
  },
  {
    id: 'lesson-2',
    title: 'Listing Files',
    description: 'See what files and folders are in your current directory',
    commands: ['ls'],
    challenges: [
      {
        id: 'challenge-5',
        description: 'Now let\'s learn about "ls" (list). This command shows files and directories in your current folder.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-6',
        description: 'Try using "ls" to see what\'s in your current directory.',
        expectedCommand: 'ls',
        hints: ['Type "ls" and press Enter'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'file.txt', content: 'Hello', permissions: 'rw-r--r--', owner: 'user', group: 'users' },
            { name: 'notes.md', content: '# Notes', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [
            { name: 'documents', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' },
            { name: 'downloads', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-7',
        description: 'Good! Now let\'s review: First check where you are with pwd, then list files with ls.',
        expectedCommand: 'pwd && ls',
        hints: ['Use "pwd" then "ls"', 'You can combine with &&'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'file.txt', content: 'Hello', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [
            { name: 'documents', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-8',
        description: 'Challenge: Navigate to /var/log and list its contents.',
        expectedCommand: 'cd /var/log && ls',
        hints: ['First change directory: cd /var/log', 'Then list: ls'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [
            { name: 'var', permissions: 'rwxr-xr-x', owner: 'root', group: 'root' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-9',
        description: 'Great work! Now go back home and confirm with pwd.',
        expectedCommand: 'cd ~ && pwd',
        hints: ['~ means home directory', 'Use "cd ~" to go home'],
        fileSystemState: {
          currentPath: '/var/log',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-1'],
    xpReward: 50,
    visualAid: {
      type: 'filesystem',
      data: {
        teachingPoints: [
          'ls = list directory contents',
          'Shows files and folders',
          'Useful to see what\'s available',
          '~ = home directory shortcut'
        ]
      }
    }
  },
  {
    id: 'lesson-3',
    title: 'Changing Directories',
    description: 'Navigate between different folders',
    commands: ['cd'],
    challenges: [
      {
        id: 'challenge-10',
        description: 'Now let\'s learn "cd" (change directory). This lets you move between folders.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-11',
        description: 'Use "cd documents" to enter the documents directory.',
        expectedCommand: 'cd documents',
        hints: ['Type "cd documents" and press Enter'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [
            { name: 'documents', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-12',
        description: 'Good! Now use "cd .." to go back up one directory. ".." means parent directory.',
        expectedCommand: 'cd ..',
        hints: ['Type "cd .." and press Enter'],
        fileSystemState: {
          currentPath: '/home/user/documents',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-13',
        description: 'Review: First list files with ls, then navigate to downloads directory.',
        expectedCommand: 'ls && cd downloads',
        hints: ['Combine commands: ls && cd downloads'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [
            { name: 'downloads', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' },
            { name: 'documents', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-14',
        description: 'Now go to the absolute path /usr/bin. First check it exists with ls /usr, then cd there.',
        expectedCommand: 'ls /usr && cd /usr/bin',
        hints: ['First "ls /usr" to see bin directory exists', 'Then "cd /usr/bin"'],
        fileSystemState: {
          currentPath: '/home/user/downloads',
          files: [],
          directories: [
            { name: 'usr', permissions: 'rwxr-xr-x', owner: 'root', group: 'root' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-15',
        description: 'Final challenge: Go home, list files, then go to /tmp directory.',
        expectedCommand: 'cd ~ && ls && cd /tmp',
        hints: ['cd ~ goes home', 'Then ls', 'Finally cd /tmp'],
        fileSystemState: {
          currentPath: '/usr/bin',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-2'],
    xpReward: 60,
    visualAid: {
      type: 'command-flow',
      data: { 
        teachingPoints: [
          'cd = change directory',
          'cd folder_name - enter folder',
          'cd .. - go to parent directory',
          'cd /path - absolute path',
          'cd ~ - go home',
          'Absolute paths start with /'
        ]
      }
    }
  },
  {
    id: 'lesson-4',
    title: 'Viewing File Contents',
    description: 'Read what\'s inside files',
    commands: ['cat'],
    challenges: [
      {
        id: 'challenge-16',
        description: 'Now learn "cat" (concatenate). This command displays file contents.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-17',
        description: 'Use "cat notes.md" to read the notes file.',
        expectedCommand: 'cat notes.md',
        hints: ['Type "cat notes.md" and press Enter'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'notes.md', content: '# My Notes\n\nImportant stuff here.', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-18',
        description: 'Good! Now combine commands: list files, then read file.txt.',
        expectedCommand: 'ls && cat file.txt',
        hints: ['First ls, then cat file.txt'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'file.txt', content: 'Hello World!\nWelcome to CLI Master.', permissions: 'rw-r--r--', owner: 'user', group: 'users' },
            { name: 'notes.md', content: '# Notes', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-19',
        description: 'Scenario: You\'re in /var/log. Check what files exist and read system.log.',
        expectedCommand: 'ls && cat system.log',
        hints: ['First ls to see files', 'Then cat system.log to read it'],
        fileSystemState: {
          currentPath: '/var/log',
          files: [
            { name: 'system.log', content: 'System boot completed\nServices started', permissions: 'rw-r--r--', owner: 'root', group: 'root' },
            { name: 'auth.log', content: 'User login successful', permissions: 'rw-r--r--', owner: 'root', group: 'root' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-20',
        description: 'Review: Navigate home, list files, then read notes.md.',
        expectedCommand: 'cd ~ && ls && cat notes.md',
        hints: ['cd ~ goes home', 'ls lists files', 'cat notes.md reads file'],
        fileSystemState: {
          currentPath: '/var/log',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-3'],
    xpReward: 60,
    visualAid: {
      type: 'output-visualization',
      data: {
        teachingPoints: [
          'cat = concatenate and display files',
          'Shows file contents in terminal',
          'Useful for reading logs, configs, notes',
          'Combine with ls to see then read'
        ]
      }
    }
  },
  {
    id: 'lesson-5',
    title: 'Creating Files',
    description: 'Make new empty files',
    commands: ['touch'],
    challenges: [
      {
        id: 'challenge-21',
        description: 'Learn "touch" - creates empty files or updates timestamps.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-22',
        description: 'Create a file called "todo.txt" in your current directory.',
        expectedCommand: 'touch todo.txt',
        hints: ['Type "touch todo.txt" and press Enter'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-23',
        description: 'Now list files to see your new todo.txt, then create another file "shopping.txt".',
        expectedCommand: 'ls && touch shopping.txt',
        hints: ['First ls to confirm', 'Then touch shopping.txt'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-24',
        description: 'Scenario: Navigate to documents directory and create a file "meeting_notes.txt".',
        expectedCommand: 'cd documents && touch meeting_notes.txt',
        hints: ['First cd documents', 'Then touch meeting_notes.txt'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [
            { name: 'documents', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-25',
        description: 'Review: Go home, create file "backup.sh", list to confirm, then read its (empty) contents.',
        expectedCommand: 'cd ~ && touch backup.sh && ls && cat backup.sh',
        hints: ['cd ~ goes home', 'touch backup.sh creates file', 'ls shows it', 'cat reads it'],
        fileSystemState: {
          currentPath: '/home/user/documents',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-4'],
    xpReward: 70,
    visualAid: {
      type: 'command-flow',
      data: {
        teachingPoints: [
          'touch = create empty files',
          'Also updates file timestamps',
          'Useful for creating placeholder files',
          'Often used before editing files'
        ]
      }
    }
  },
  {
    id: 'lesson-6',
    title: 'Creating Directories',
    description: 'Make new folders',
    commands: ['mkdir'],
    challenges: [
      {
        id: 'challenge-26',
        description: 'Learn "mkdir" (make directory) - creates new folders.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-27',
        description: 'Create a directory called "projects" in your current folder.',
        expectedCommand: 'mkdir projects',
        hints: ['Type "mkdir projects" and press Enter'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-28',
        description: 'Now list files to see your new projects directory, then create "music" directory.',
        expectedCommand: 'ls && mkdir music',
        hints: ['First ls to confirm', 'Then mkdir music'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-29',
        description: 'Scenario: Navigate into projects, create "src" and "docs" directories inside.',
        expectedCommand: 'cd projects && mkdir src docs',
        hints: ['First cd projects', 'mkdir can create multiple: mkdir src docs'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [
            { name: 'projects', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-30',
        description: 'Review: Go home, create "backups" directory, enter it, create "daily" subdirectory.',
        expectedCommand: 'cd ~ && mkdir backups && cd backups && mkdir daily',
        hints: ['cd ~ goes home', 'mkdir backups', 'cd backups', 'mkdir daily'],
        fileSystemState: {
          currentPath: '/home/user/projects',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-5'],
    xpReward: 70,
    visualAid: {
      type: 'filesystem',
      data: {
        teachingPoints: [
          'mkdir = make directory',
          'Creates new folders',
          'Can create multiple at once: mkdir dir1 dir2 dir3',
          'Organize files into directories'
        ]
      }
    }
  },
  {
    id: 'lesson-7',
    title: 'Printing Text',
    description: 'Display messages in the terminal',
    commands: ['echo'],
    challenges: [
      {
        id: 'challenge-31',
        description: 'Learn "echo" - prints text to the terminal.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-32',
        description: 'Use echo to print "Hello CLI Master!"',
        expectedCommand: 'echo "Hello CLI Master!"',
        hints: ['Type \'echo "Hello CLI Master!"\' and press Enter'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-33',
        description: 'Now combine: print a message, then list files.',
        expectedCommand: 'echo "Files in current directory:" && ls',
        hints: ['First echo message', 'Then ls with &&'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-34',
        description: 'Scenario: Navigate to /tmp, print "Working in temp directory", then create a temp file.',
        expectedCommand: 'cd /tmp && echo "Working in temp directory" && touch temp_file.txt',
        hints: ['cd /tmp', 'echo message', 'touch temp_file.txt'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-35',
        description: 'Review: Go home, print welcome message, create directory, enter it, create file.',
        expectedCommand: 'cd ~ && echo "Welcome home!" && mkdir work && cd work && touch task.txt',
        hints: ['cd ~', 'echo message', 'mkdir work', 'cd work', 'touch task.txt'],
        fileSystemState: {
          currentPath: '/tmp',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-6'],
    xpReward: 80,
    visualAid: {
      type: 'output-visualization',
      data: {
        teachingPoints: [
          'echo = print text to terminal',
          'Useful for messages, debugging',
          'Can create file content: echo "text" > file.txt',
          'Combine with other commands using &&'
        ]
      }
    }
  },
  {
    id: 'lesson-8',
    title: 'Cleaning the Screen',
    description: 'Clear terminal output',
    commands: ['clear'],
    challenges: [
      {
        id: 'challenge-36',
        description: 'Learn "clear" - cleans the terminal screen.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-37',
        description: 'Try clearing your terminal screen.',
        expectedCommand: 'clear',
        hints: ['Type "clear" and press Enter'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-38',
        description: 'Now do some work: list files, create a file, then clear screen.',
        expectedCommand: 'ls && touch test.txt && clear',
        hints: ['First ls', 'Then touch test.txt', 'Finally clear'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-39',
        description: 'Scenario: Print a message, create directory, list contents, then clear.',
        expectedCommand: 'echo "Creating project..." && mkdir myproject && cd myproject && ls && clear',
        hints: ['echo message', 'mkdir myproject', 'cd myproject', 'ls', 'clear'],
        fileSystemState: {
          currentPath: '/home/user/work',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-40',
        description: 'Review: Full workflow - go home, print status, create structure, clear.',
        expectedCommand: 'cd ~ && echo "Setting up..." && mkdir -p app/{src,test,docs} && ls app && clear',
        hints: ['cd ~', 'echo message', 'mkdir -p creates parent dirs', 'ls app', 'clear'],
        fileSystemState: {
          currentPath: '/home/user/work',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-7'],
    xpReward: 90,
    visualAid: {
      type: 'command-flow',
      data: {
        teachingPoints: [
          'clear = clean terminal screen',
          'Keeps workspace tidy',
          'Useful after lots of output',
          'Doesn\'t delete files, just clears display'
        ]
      }
    }
  },
  {
    id: 'lesson-9',
    title: 'Review Practice',
    description: 'Practice all commands you\'ve learned',
    commands: ['pwd', 'ls', 'cd', 'cat', 'touch', 'mkdir', 'echo', 'clear'],
    challenges: [
      {
        id: 'challenge-41',
        description: 'Time to review! You\'ll practice all commands in realistic scenarios.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-42',
        description: 'Scenario 1: Check where you are, then list files.',
        expectedCommand: 'pwd && ls',
        hints: ['First pwd', 'Then ls'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'notes.md', content: '# Review', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [
            { name: 'documents', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-43',
        description: 'Scenario 2: Navigate to documents, create a todo file, read it.',
        expectedCommand: 'cd documents && touch todo.txt && echo "Buy milk" > todo.txt && cat todo.txt',
        hints: ['cd documents', 'touch todo.txt', 'echo content into file', 'cat to read'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [
            { name: 'documents', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-44',
        description: 'Scenario 3: Go home, create project structure, verify.',
        expectedCommand: 'cd ~ && mkdir -p myproject/{src,docs,tests} && ls myproject',
        hints: ['cd ~ goes home', 'mkdir -p creates nested dirs', 'ls myproject shows result'],
        fileSystemState: {
          currentPath: '/home/user/documents',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-45',
        description: 'Scenario 4: In project, create files, list, then clean screen.',
        expectedCommand: 'cd myproject && touch src/main.py docs/README.md && ls -R && clear',
        hints: ['cd myproject', 'touch multiple files', 'ls -R shows recursively', 'clear screen'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [
            { name: 'myproject', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-46',
        description: 'Final review: Complete setup with messages and verification.',
        expectedCommand: 'echo "Project setup complete" && pwd && ls && echo "All done!" && clear',
        hints: ['echo message', 'pwd shows location', 'ls shows files', 'final echo', 'clear'],
        fileSystemState: {
          currentPath: '/home/user/myproject',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-8'],
    xpReward: 100,
    visualAid: {
      type: 'command-flow',
      data: {
        teachingPoints: [
          'Review all commands together',
          'Real-world scenarios',
          'Command combination practice',
          'Preparation for real usage'
        ]
      }
    }
  },
  {
    id: 'lesson-10',
    title: 'Final Challenge',
    description: 'Complete a real-world scenario',
    commands: ['all'],
    challenges: [
      {
        id: 'challenge-47',
        description: 'Final exam! You\'ll complete a real-world project setup.',
        expectedCommand: '',
        hints: ['Press Enter to begin'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-48',
        description: 'Task 1: Create a new project folder "cli-app".',
        expectedCommand: 'mkdir cli-app',
        hints: ['mkdir cli-app'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-49',
        description: 'Task 2: Enter the project and create standard directories.',
        expectedCommand: 'cd cli-app && mkdir src docs tests',
        hints: ['cd cli-app', 'mkdir src docs tests'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [
            { name: 'cli-app', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-50',
        description: 'Task 3: Create a README with project description.',
        expectedCommand: 'echo "# CLI Master App\nA terminal learning tool." > README.md',
        hints: ['echo content into README.md'],
        fileSystemState: {
          currentPath: '/home/user/cli-app',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-51',
        description: 'Task 4: Create a main script and config file.',
        expectedCommand: 'touch src/main.sh src/config.json',
        hints: ['touch can create multiple files'],
        fileSystemState: {
          currentPath: '/home/user/cli-app',
          files: [],
          directories: [
            { name: 'src', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' },
            { name: 'docs', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' },
            { name: 'tests', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-52',
        description: 'Task 5: Verify setup by listing all files recursively.',
        expectedCommand: 'ls -R',
        hints: ['ls -R shows all files and directories'],
        fileSystemState: {
          currentPath: '/home/user/cli-app',
          files: [
            { name: 'README.md', content: '# CLI Master App\nA terminal learning tool.', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-53',
        description: 'Task 6: Final check - print completion message and clear.',
        expectedCommand: 'echo "Project setup complete!" && pwd && clear',
        hints: ['echo message', 'pwd shows location', 'clear cleans screen'],
        fileSystemState: {
          currentPath: '/home/user/cli-app',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-9'],
    xpReward: 150,
    visualAid: {
      type: 'filesystem',
      data: {
        teachingPoints: [
          'Real-world project setup',
          'Complete workflow from start to finish',
          'Directory structure creation',
          'File creation with content',
          'Verification and cleanup'
        ]
      }
    }
  },
  {
    id: 'review-1',
    title: 'Mid-Course Review',
    description: 'Practice core commands with exercises only',
    commands: ['pwd', 'ls', 'cd', 'cat'],
    challenges: [
      {
        id: 'challenge-54',
        description: 'Exercise 1: Check your location and list files.',
        expectedCommand: 'pwd && ls',
        hints: ['First pwd, then ls with &&'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'notes.txt', content: 'Review notes', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [
            { name: 'review', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-55',
        description: 'Exercise 2: Navigate to review directory and read notes.txt.',
        expectedCommand: 'cd review && cat notes.txt',
        hints: ['cd review to enter directory', 'cat notes.txt to read file'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [
            { name: 'review', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-56',
        description: 'Exercise 3: Go home, create practice file with content.',
        expectedCommand: 'cd ~ && touch practice.txt && echo "Practice makes perfect" > practice.txt && cat practice.txt',
        hints: ['cd ~ goes home', 'touch creates file', 'echo adds content', 'cat reads it'],
        fileSystemState: {
          currentPath: '/home/user/review',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-57',
        description: 'Exercise 4: Navigate to /tmp, create test directory.',
        expectedCommand: 'cd /tmp && ls && mkdir test_review && cd test_review && pwd',
        hints: ['cd /tmp', 'ls shows empty', 'mkdir test_review', 'cd test_review', 'pwd confirms'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-5'],
    xpReward: 120,
    visualAid: {
      type: 'command-flow',
      data: {
        teachingPoints: [
          'Review core commands',
          'Practice navigation and file ops',
          'Build confidence with combinations',
          'Prepare for advanced topics'
        ]
      }
    }
  },
  {
    id: 'review-2',
    title: 'Advanced Practice',
    description: 'Master command combinations with exercises only',
    commands: ['all'],
    challenges: [
      {
        id: 'challenge-58',
        description: 'Exercise 1: Create nested project directory structure.',
        expectedCommand: 'mkdir -p project/{src/{utils,lib},docs,config}',
        hints: ['mkdir -p creates parent directories', '{} creates multiple at once'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-59',
        description: 'Exercise 2: Enter project and create configuration files.',
        expectedCommand: 'cd project && touch config/settings.json src/main.py docs/README.md',
        hints: ['cd project', 'touch can create multiple files'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [
            { name: 'project', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-60',
        description: 'Exercise 3: Add README content and list recursively.',
        expectedCommand: 'echo "# My Project\\nA CLI learning tool." > docs/README.md && ls -R',
        hints: ['echo with > writes to file', '\\n creates new line', 'ls -R shows recursively'],
        fileSystemState: {
          currentPath: '/home/user/project',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-61',
        description: 'Exercise 4: Clean up and print completion.',
        expectedCommand: 'cd ~ && echo "Project setup complete!" && clear',
        hints: ['cd ~ goes home', 'echo prints message', 'clear cleans terminal'],
        fileSystemState: {
          currentPath: '/home/user/project',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['review-1'],
    xpReward: 140,
    visualAid: {
      type: 'command-flow',
      data: {
        teachingPoints: [
          'Advanced command combinations',
          'Complex directory structures',
          'Recursive file listing',
          'Professional workflows'
        ]
      }
    }
  },
  {
    id: 'lesson-11',
    title: 'Finding Files',
    description: 'Search for files and directories',
    commands: ['find', 'locate'],
    challenges: [
      {
        id: 'challenge-62',
        description: 'Learn "find" - searches for files matching criteria.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'notes.txt', content: 'Important notes', permissions: 'rw-r--r--', owner: 'user', group: 'users' },
            { name: 'todo.md', content: '# Todo', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [
            { name: 'documents', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' },
            { name: 'downloads', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-63',
        description: 'Find all .txt files in current directory.',
        expectedCommand: 'find . -name "*.txt"',
        hints: ['find . searches current directory', '-name "*.txt" matches .txt files'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'notes.txt', content: 'Important notes', permissions: 'rw-r--r--', owner: 'user', group: 'users' },
            { name: 'todo.md', content: '# Todo', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [
            { name: 'documents', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-64',
        description: 'Find files modified in last 7 days.',
        expectedCommand: 'find . -mtime -7',
        hints: ['-mtime -7 finds files modified within 7 days'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'recent.txt', content: 'Recent file', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-65',
        description: 'Find and list directories (not files).',
        expectedCommand: 'find . -type d',
        hints: ['-type d finds directories only'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [
            { name: 'docs', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' },
            { name: 'src', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-66',
        description: 'Find files larger than 1MB and list details.',
        expectedCommand: 'find . -size +1M -ls',
        hints: ['-size +1M finds files >1MB', '-ls lists detailed info'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'large.log', content: 'x'.repeat(2000000), permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-10'],
    xpReward: 160,
    visualAid: {
      type: 'command-flow',
      data: {
        teachingPoints: [
          'find = search for files/directories',
          '. = current directory',
          '-name = match filename pattern',
          '-type = file type (f=file, d=directory)',
          '-mtime = modification time',
          '-size = file size'
        ]
      }
    }
  },
  {
    id: 'lesson-12',
    title: 'Text Searching',
    description: 'Search within files using grep',
    commands: ['grep'],
    challenges: [
      {
        id: 'challenge-67',
        description: 'Learn "grep" - searches for patterns within files.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'server.log', content: 'ERROR: Database connection failed\nINFO: Server started\nERROR: Timeout occurred\nINFO: User logged in', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-68',
        description: 'Search for "ERROR" in server.log.',
        expectedCommand: 'grep "ERROR" server.log',
        hints: ['grep "pattern" file'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'server.log', content: 'ERROR: Database connection failed\nINFO: Server started\nERROR: Timeout occurred\nINFO: User logged in', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-69',
        description: 'Search for "INFO" (case-insensitive).',
        expectedCommand: 'grep -i "info" server.log',
        hints: ['-i makes search case-insensitive'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'server.log', content: 'ERROR: Database connection failed\nINFO: Server started\nERROR: Timeout occurred\ninfo: User logged in', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-70',
        description: 'Count occurrences of "ERROR".',
        expectedCommand: 'grep -c "ERROR" server.log',
        hints: ['-c counts matching lines'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'server.log', content: 'ERROR: Database connection failed\nINFO: Server started\nERROR: Timeout occurred\nINFO: User logged in', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-71',
        description: 'Search recursively in all files.',
        expectedCommand: 'grep -r "TODO" .',
        hints: ['-r searches recursively', '. = current directory'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'notes.txt', content: 'TODO: Finish project\nImportant meeting tomorrow', permissions: 'rw-r--r--', owner: 'user', group: 'users' },
            { name: 'src/main.py', content: '# TODO: Add error handling\ndef main(): pass', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [
            { name: 'src', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-11'],
    xpReward: 170,
    visualAid: {
      type: 'output-visualization',
      data: {
        teachingPoints: [
          'grep = search for patterns in files',
          'Basic: grep "pattern" file',
          '-i = case-insensitive search',
          '-c = count matches',
          '-r = recursive search',
          '-v = invert match (lines NOT containing pattern)'
        ]
      }
    }
  },
  {
    id: 'lesson-13',
    title: 'Text Processing',
    description: 'Transform text with sed and awk',
    commands: ['sed', 'awk', 'cut'],
    challenges: [
      {
        id: 'challenge-72',
        description: 'Learn "sed" - stream editor for text transformation.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'data.txt', content: 'apple\nbanana\ncherry\ndate\nelderberry', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-73',
        description: 'Replace "apple" with "apricot" in data.txt.',
        expectedCommand: 'sed "s/apple/apricot/" data.txt',
        hints: ['sed "s/old/new/" file'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'data.txt', content: 'apple\nbanana\ncherry\ndate\nelderberry', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-74',
        description: 'Delete lines containing "cherry".',
        expectedCommand: 'sed "/cherry/d" data.txt',
        hints: ['/pattern/d deletes matching lines'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'data.txt', content: 'apple\nbanana\ncherry\ndate\nelderberry', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-75',
        description: 'Learn "awk" - pattern scanning and processing.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'users.csv', content: 'John,25,Engineer\nJane,30,Designer\nBob,28,Manager', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-76',
        description: 'Print first column (names) from users.csv.',
        expectedCommand: 'awk -F"," "{print $1}" users.csv',
        hints: ['-F"," sets field separator', '{print $1} prints first field'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'users.csv', content: 'John,25,Engineer\nJane,30,Designer\nBob,28,Manager', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-77',
        description: 'Print users older than 27.',
        expectedCommand: 'awk -F"," "$2 > 27 {print $1}" users.csv',
        hints: ['$2 > 27 filters where age > 27'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'users.csv', content: 'John,25,Engineer\nJane,30,Designer\nBob,28,Manager', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-12'],
    xpReward: 180,
    visualAid: {
      type: 'command-flow',
      data: {
        teachingPoints: [
          'sed = stream editor for text',
          's/old/new/ = substitute',
          '/pattern/d = delete matching lines',
          'awk = pattern scanning language',
          '-F = field separator',
          '$1, $2 = field variables'
        ]
      }
    }
  },
  {
    id: 'lesson-14',
    title: 'Process Management',
    description: 'Manage running processes',
    commands: ['ps', 'top', 'kill', 'jobs'],
    challenges: [
      {
        id: 'challenge-78',
        description: 'Learn "ps" - shows running processes.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', PROCESSES: '["bash","node","python","sleep"]' }
        }
      },
      {
        id: 'challenge-79',
        description: 'List all processes for current user.',
        expectedCommand: 'ps aux | grep $USER',
        hints: ['ps aux lists all processes', '| grep $USER filters for current user'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', PROCESSES: '["bash","node","python","sleep"]' }
        }
      },
      {
        id: 'challenge-80',
        description: 'Show process tree hierarchy.',
        expectedCommand: 'ps -ef --forest',
        hints: ['-ef shows full format', '--forest shows tree view'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', PROCESSES: '["bash","node","python","sleep"]' }
        }
      },
      {
        id: 'challenge-81',
        description: 'Learn "kill" - terminate processes.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', PROCESSES: '["bash","node","python","sleep 1000"]' }
        }
      },
      {
        id: 'challenge-82',
        description: 'Send SIGTERM to process (graceful termination).',
        expectedCommand: 'kill -TERM 1234',
        hints: ['kill -TERM PID sends terminate signal'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', PROCESSES: '["bash","node","python","sleep 1000"]' }
        }
      },
      {
        id: 'challenge-83',
        description: 'Force kill process with SIGKILL.',
        expectedCommand: 'kill -KILL 1234',
        hints: ['-KILL forces immediate termination'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', PROCESSES: '["bash","node","python","sleep 1000"]' }
        }
      }
    ],
    prerequisites: ['lesson-13'],
    xpReward: 190,
    visualAid: {
      type: 'command-flow',
      data: {
        teachingPoints: [
          'ps = process status',
          'aux = all processes, user-oriented format',
          'kill = terminate processes',
          'SIGTERM = graceful termination',
          'SIGKILL = force kill',
          'jobs = background job management'
        ]
      }
    }
  }
  ,

  {
    id: 'lesson-15',
    title: 'Networking Fundamentals',
    description: 'Test connectivity and transfer data',
    commands: ['ping', 'curl'],
    challenges: [
      {
        id: 'challenge-84',
        description: 'Learn "ping" - test network connectivity to a host.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-85',
        description: 'Ping google.com to test internet connectivity.',
        expectedCommand: 'ping -c 4 google.com',
        hints: ['ping host sends ICMP packets', '-c 4 sends 4 packets then stops'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', NETWORK: 'connected' }
        }
      },
      {
        id: 'challenge-86',
        description: 'Learn "curl" - transfer data from URLs.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-87',
        description: 'Use curl to fetch a webpage and save to file.',
        expectedCommand: 'curl -o example.html https://example.com',
        hints: ['curl URL fetches content', '-o file saves output to file'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', NETWORK: 'connected' }
        }
      },
      {
        id: 'challenge-88',
        description: 'Check HTTP headers with curl.',
        expectedCommand: 'curl -I https://example.com',
        hints: ['-I fetches headers only', 'Shows server info, content type'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', NETWORK: 'connected' }
        }
      },
      {
        id: 'challenge-89',
        description: 'Complete network test: ping then fetch page.',
        expectedCommand: 'ping -c 2 example.com && curl -s https://example.com | head -5',
        hints: ['ping first to test connectivity', 'curl -s silent mode', 'head -5 shows first 5 lines'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', NETWORK: 'connected' }
        }
      }
    ],
    prerequisites: ['lesson-14'],
    xpReward: 200,
    visualAid: {
      type: 'command-flow',
      data: {
        teachingPoints: [
          'ping = test network connectivity',
          '-c count = send specific number of packets',
          'curl = client for URL transfers',
          '-o file = save output to file',
          '-I = fetch headers only',
          '-s = silent mode (no progress)'
        ]
      }
    }
  },
  {
    id: 'lesson-16',
    title: 'Secure Shell & Remote Access',
    description: 'Connect to remote systems securely',
    commands: ['ssh', 'scp'],
    challenges: [
      {
        id: 'challenge-90',
        description: 'Learn "ssh" - secure shell for remote login.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-91',
        description: 'Connect to localhost via SSH.',
        expectedCommand: 'ssh localhost',
        hints: ['ssh hostname connects to remote host', 'localhost is your own machine'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', SSH_AVAILABLE: 'true' }
        }
      },
      {
        id: 'challenge-92',
        description: 'Run command remotely via SSH without full login.',
        expectedCommand: 'ssh localhost "ls -la"',
        hints: ['ssh host "command" runs command remotely', 'Quotes around command'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', SSH_AVAILABLE: 'true' }
        }
      },
      {
        id: 'challenge-93',
        description: 'Learn "scp" - secure copy between systems.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'local.txt', content: 'Local file content', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-94',
        description: 'Copy file to remote system.',
        expectedCommand: 'scp local.txt user@localhost:/tmp/',
        hints: ['scp source destination', 'user@host:path format', '/tmp/ is destination directory'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'local.txt', content: 'Local file content', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user', SSH_AVAILABLE: 'true' }
        }
      },
      {
        id: 'challenge-95',
        description: 'Copy file from remote system.',
        expectedCommand: 'scp user@localhost:/tmp/remote.txt ./',
        hints: ['scp user@host:file destination', './ means current directory'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', SSH_AVAILABLE: 'true', REMOTE_FILE: 'true' }
        }
      }
    ],
    prerequisites: ['lesson-15'],
    xpReward: 210,
    visualAid: {
      type: 'command-flow',
      data: {
        teachingPoints: [
          'ssh = secure shell remote login',
          'ssh host "command" = run remote command',
          'scp = secure copy between systems',
          'user@host:path = remote path format',
          'Useful for remote administration',
          'Essential for cloud servers'
        ]
      }
    }
  },
  {
    id: 'lesson-17',
    title: 'Advanced Process Management',
    description: 'Control background jobs and process priority',
    commands: ['jobs', 'bg', 'fg', 'nice', 'nohup'],
    challenges: [
      {
        id: 'challenge-96',
        description: 'Learn about job control - managing background processes.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-97',
        description: 'Start a process in background with &.',
        expectedCommand: 'sleep 30 &',
        hints: ['& at end runs process in background', 'Returns job ID'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-98',
        description: 'List background jobs.',
        expectedCommand: 'jobs',
        hints: ['jobs lists background jobs', 'Shows job numbers and status'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', BACKGROUND_JOBS: '["sleep 30"]' }
        }
      },
      {
        id: 'challenge-99',
        description: 'Bring background job to foreground.',
        expectedCommand: 'fg %1',
        hints: ['fg %jobnumber brings job to foreground', '%1 refers to job 1'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user', BACKGROUND_JOBS: '["sleep 30"]' }
        }
      },
      {
        id: 'challenge-100',
        description: 'Learn "nice" - set process priority.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-101',
        description: 'Run command with low priority.',
        expectedCommand: 'nice -n 19 sleep 10',
        hints: ['nice -n value command', 'Higher nice value = lower priority', '19 is lowest priority'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-102',
        description: 'Use "nohup" to keep process running after logout.',
        expectedCommand: 'nohup sleep 60 &',
        hints: ['nohup command &', 'Process continues after terminal closes', 'Output goes to nohup.out'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-14'],
    xpReward: 220,
    visualAid: {
      type: 'command-flow',
      data: {
        teachingPoints: [
          '& = run in background',
          'jobs = list background jobs',
          'fg = bring to foreground',
          'bg = send to background',
          'nice = set process priority',
          'nohup = continue after logout'
        ]
      }
    }
  },
  {
    id: 'lesson-18',
    title: 'System Monitoring & Archives',
    description: 'Monitor system resources and manage archives',
    commands: ['df', 'du', 'free', 'tar', 'gzip'],
    challenges: [
      {
        id: 'challenge-103',
        description: 'Learn system monitoring commands.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-104',
        description: 'Check disk space with "df".',
        expectedCommand: 'df -h',
        hints: ['df = disk free', '-h = human readable format', 'Shows filesystem usage'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-105',
        description: 'Check directory size with "du".',
        expectedCommand: 'du -sh /var/log',
        hints: ['du = disk usage', '-s = summary total', '-h = human readable', '/var/log = directory to check'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-106',
        description: 'Check memory usage with "free".',
        expectedCommand: 'free -h',
        hints: ['free = memory usage', '-h = human readable', 'Shows RAM and swap'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-107',
        description: 'Learn "tar" - archive files.',
        expectedCommand: '',
        hints: ['Press Enter to continue'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'file1.txt', content: 'Content 1', permissions: 'rw-r--r--', owner: 'user', group: 'users' },
            { name: 'file2.txt', content: 'Content 2', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-108',
        description: 'Create tar archive.',
        expectedCommand: 'tar -cf archive.tar file1.txt file2.txt',
        hints: ['tar -c create', '-f file specifies archive name', 'List files to include'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'file1.txt', content: 'Content 1', permissions: 'rw-r--r--', owner: 'user', group: 'users' },
            { name: 'file2.txt', content: 'Content 2', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-109',
        description: 'Extract tar archive.',
        expectedCommand: 'tar -xf archive.tar',
        hints: ['tar -x extract', '-f file archive to extract', 'Extracts to current directory'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [
            { name: 'archive.tar', content: 'binary', permissions: 'rw-r--r--', owner: 'user', group: 'users' }
          ],
          directories: [],
          environment: { USER: 'user' }
        }
      },
      {
        id: 'challenge-110',
        description: 'Create compressed tar archive.',
        expectedCommand: 'tar -czf backup.tar.gz /home/user/documents',
        hints: ['-c create, -z gzip compress, -f file', 'Creates compressed archive'],
        fileSystemState: {
          currentPath: '/home/user',
          files: [],
          directories: [
            { name: 'documents', permissions: 'rwxr-xr-x', owner: 'user', group: 'users' }
          ],
          environment: { USER: 'user' }
        }
      }
    ],
    prerequisites: ['lesson-16'],
    xpReward: 230,
    visualAid: {
      type: 'command-flow',
      data: {
        teachingPoints: [
          'df = disk free space',
          'du = disk usage by directory',
          'free = memory usage',
          'tar = tape archive for files',
          '-c = create, -x = extract',
          '-z = gzip compression'
        ]
      }
    }
  },
];

export const getLessonById = (id: string): Lesson | undefined => {
  return lessons.find(lesson => lesson.id === id);
};

export const isLessonUnlocked = (lesson: Lesson, completedLessons: Set<string>): boolean => {
  if (lesson.prerequisites.length === 0) return true;
  return lesson.prerequisites.every(prereq => completedLessons.has(prereq));
};

export interface Unit {
  id: string;
  name: string;
  description: string;
  icon: string;
  lessonIds: string[];
  color: string;
}

export const units: Unit[] = [
  {
    id: 'unit-1',
    name: 'File Management',
    description: 'Navigate and manage files and directories',
    icon: '📁',
    lessonIds: ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5', 'lesson-6', 'lesson-7', 'lesson-8'],
    color: '#3B82F6'
  },
  {
    id: 'unit-2',
    name: 'Text Processing',
    description: 'Search, filter, and manipulate text',
    icon: '📝',
    lessonIds: ['lesson-11', 'lesson-12', 'lesson-13'],
    color: '#10B981'
  },
  {
    id: 'unit-3',
    name: 'Process Management',
    description: 'Control and monitor running processes',
    icon: '⚙️',
    lessonIds: ['lesson-14'],
    color: '#EF4444'
  },
  {
    id: 'unit-4',
    name: 'Practice & Review',
    description: 'Reinforce your skills with exercises',
    icon: '🔁',
    lessonIds: ['lesson-9', 'lesson-10', 'review-1', 'review-2'],
    color: '#F59E0B'
  }
];

export const getUnitByLessonId = (lessonId: string): Unit | undefined => {
  return units.find(unit => unit.lessonIds.includes(lessonId));
};

export const getNextLessonId = (currentLessonId: string): string | null => {
  const index = lessons.findIndex(lesson => lesson.id === currentLessonId);
  if (index === -1 || index >= lessons.length - 1) return null;
  return lessons[index + 1].id;
};