import { describe, it, expect, beforeEach } from 'vitest'
import { CLISimulator } from './simulator'

describe('CLISimulator', () => {
  let simulator: CLISimulator

  beforeEach(() => {
    simulator = new CLISimulator()
  })

  describe('basic commands', () => {
    it('should execute pwd command', () => {
      const result = simulator.executeCommand('pwd')
      expect(result.success).toBe(true)
      expect(result.output).toContain('/home/user')
    })

    it('should execute ls command', () => {
      const result = simulator.executeCommand('ls')
      expect(result.success).toBe(true)
      expect(result.output).toContain('documents')
      expect(result.output).toContain('downloads')
    })

    it('should execute cd command', () => {
      simulator.executeCommand('cd documents')
      const pwdResult = simulator.executeCommand('pwd')
      expect(pwdResult.output).toContain('/home/user/documents')
    })

    it('should handle cd ..', () => {
      simulator.executeCommand('cd documents')
      simulator.executeCommand('cd ..')
      const pwdResult = simulator.executeCommand('pwd')
      expect(pwdResult.output).toContain('/home/user')
    })

    it('should execute echo command', () => {
      const result = simulator.executeCommand('echo Hello World')
      expect(result.success).toBe(true)
      expect(result.output).toBe('Hello World\n')
    })
  })

  describe('file operations', () => {
    it('should create file with touch', () => {
      const result = simulator.executeCommand('touch test.txt')
      expect(result.success).toBe(true)
      
      const lsResult = simulator.executeCommand('ls')
      expect(lsResult.output).toContain('test.txt')
    })

    it('should create directory with mkdir', () => {
      const result = simulator.executeCommand('mkdir testdir')
      expect(result.success).toBe(true)
      
      const lsResult = simulator.executeCommand('ls')
      expect(lsResult.output).toContain('testdir')
    })

    it('should read file with cat', () => {
      simulator.executeCommand('echo "File content" > test.txt')
      const result = simulator.executeCommand('cat test.txt')
      expect(result.success).toBe(true)
      expect(result.output).toBe('File content\n')
    })
  })

  describe('command chaining', () => {
    it('should execute multiple commands with &&', () => {
      const result = simulator.executeCommand('pwd && ls')
      expect(result.success).toBe(true)
      expect(result.output).toContain('/home/user')
      expect(result.output).toContain('documents')
    })

    it('should handle failed command in chain', () => {
      const result = simulator.executeCommand('cd non-existent && ls')
      expect(result.success).toBe(false)
    })
  })

  describe('new commands', () => {
    it('should execute grep command', () => {
      simulator.executeCommand('echo "ERROR: Something went wrong" > log.txt')
      simulator.executeCommand('echo "INFO: System started" >> log.txt')
      
      const result = simulator.executeCommand('grep ERROR log.txt')
      expect(result.success).toBe(true)
      expect(result.output).toContain('ERROR')
    })

    it('should execute grep with -i flag', () => {
      simulator.executeCommand('echo "Error: test" > log.txt')
      
      const result = simulator.executeCommand('grep -i error log.txt')
      expect(result.success).toBe(true)
      expect(result.output).toContain('Error')
    })

    it('should execute find command', () => {
      simulator.executeCommand('touch test.txt')
      
      const result = simulator.executeCommand('find . -name "*.txt"')
      expect(result.success).toBe(true)
      expect(result.output).toContain('test.txt')
    })

    it('should execute sed command', () => {
      simulator.executeCommand('echo "old text" > file.txt')
      
      const result = simulator.executeCommand('sed "s/old/new/" file.txt')
      expect(result.success).toBe(true)
      expect(result.output).toContain('new text')
    })

    it('should execute awk command', () => {
      simulator.executeCommand('echo "John,25,Engineer" > data.csv')
      
      const result = simulator.executeCommand('awk -F"," "{print $1}" data.csv')
      expect(result.success).toBe(true)
      expect(result.output).toContain('John')
    })
  })

  describe('error handling', () => {
    it('should handle non-existent command', () => {
      const result = simulator.executeCommand('nonexistent')
      expect(result.success).toBe(false)
      expect(result.exitCode).toBe(127)
    })

    it('should handle cat on non-existent file', () => {
      const result = simulator.executeCommand('cat non-existent.txt')
      expect(result.success).toBe(false)
      expect(result.exitCode).toBe(1)
    })

    it('should handle cd to non-existent directory', () => {
      const result = simulator.executeCommand('cd non-existent')
      expect(result.success).toBe(false)
      expect(result.exitCode).toBe(1)
    })
  })
})
