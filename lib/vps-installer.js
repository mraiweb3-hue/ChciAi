// VPS OpenClaw Installer
// Handles automatic installation on VPS via SSH

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const VPS_HOST = '46.28.111.185'
const VPS_USER = 'root'
const INSTALL_SCRIPT = '/opt/chciai/scripts/install-openclaw.sh'

/**
 * Install OpenClaw for a client on VPS
 * @param {string} clientId - Unique client identifier
 * @param {number} port - Port number for this client (9001-9999)
 * @param {string} email - Client email
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function installOpenClawOnVPS(clientId, port, email) {
  try {
    console.log(`🚀 Starting OpenClaw installation for ${clientId} on port ${port}`)
    
    // Security: Validate inputs
    if (!clientId || !port || !email) {
      throw new Error('Missing required parameters')
    }
    
    if (port < 9001 || port > 9999) {
      throw new Error('Invalid port number')
    }
    
    // Sanitize inputs to prevent injection
    const sanitizedClientId = clientId.replace(/[^a-zA-Z0-9_-]/g, '')
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9@._-]/g, '')
    
    // Prepare SSH command with key if available
    let sshCommand = 'ssh -o StrictHostKeyChecking=no'
    
    // Use SSH key from environment if available
    if (process.env.SSH_PRIVATE_KEY) {
      // Write key to temp file
      const fs = await import('fs')
      const keyPath = '/tmp/render_ssh_key'
      await fs.promises.writeFile(keyPath, process.env.SSH_PRIVATE_KEY, { mode: 0o600 })
      sshCommand += ` -i ${keyPath}`
    }
    
    // Execute installation script via SSH
    const command = `${sshCommand} ${VPS_USER}@${VPS_HOST} 'bash ${INSTALL_SCRIPT} ${sanitizedClientId} ${port} ${sanitizedEmail}'`
    
    console.log(`📡 Executing: ${command}`)
    
    const { stdout, stderr } = await execAsync(command, {
      timeout: 180000, // 3 minutes timeout
    })
    
    if (stderr && !stderr.includes('Warning')) {
      console.error('❌ Installation stderr:', stderr)
    }
    
    console.log('✅ Installation stdout:', stdout)
    
    // Check if container is running
    const checkCommand = `ssh ${VPS_USER}@${VPS_HOST} 'docker ps --filter name=openclaw_${sanitizedClientId} --format "{{.Status}}"'`
    const { stdout: statusOutput } = await execAsync(checkCommand)
    
    if (statusOutput.includes('Up')) {
      console.log(`✅ OpenClaw running for ${clientId}`)
      return {
        success: true,
        url: `http://${VPS_HOST}:${port}`,
        containerName: `openclaw_${sanitizedClientId}`,
      }
    } else {
      throw new Error('Container not running after installation')
    }
    
  } catch (error) {
    console.error('❌ VPS installation error:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Check if OpenClaw is running for a client
 * @param {string} clientId - Unique client identifier
 * @returns {Promise<{running: boolean, status?: string}>}
 */
export async function checkOpenClawStatus(clientId) {
  try {
    const sanitizedClientId = clientId.replace(/[^a-zA-Z0-9_-]/g, '')
    const command = `ssh ${VPS_USER}@${VPS_HOST} 'docker ps -a --filter name=openclaw_${sanitizedClientId} --format "{{.Status}}"'`
    
    const { stdout } = await execAsync(command, { timeout: 10000 })
    
    return {
      running: stdout.includes('Up'),
      status: stdout.trim(),
    }
  } catch (error) {
    console.error('Status check error:', error)
    return { running: false }
  }
}

/**
 * Stop OpenClaw for a client (when trial expires)
 * @param {string} clientId - Unique client identifier
 * @returns {Promise<{success: boolean}>}
 */
export async function stopOpenClaw(clientId) {
  try {
    const sanitizedClientId = clientId.replace(/[^a-zA-Z0-9_-]/g, '')
    const command = `ssh ${VPS_USER}@${VPS_HOST} 'docker stop openclaw_${sanitizedClientId}'`
    
    await execAsync(command, { timeout: 30000 })
    console.log(`⏸️ Stopped OpenClaw for ${clientId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Stop error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Start OpenClaw for a client (when they pay)
 * @param {string} clientId - Unique client identifier
 * @returns {Promise<{success: boolean}>}
 */
export async function startOpenClaw(clientId) {
  try {
    const sanitizedClientId = clientId.replace(/[^a-zA-Z0-9_-]/g, '')
    const command = `ssh ${VPS_USER}@${VPS_HOST} 'docker start openclaw_${sanitizedClientId}'`
    
    await execAsync(command, { timeout: 30000 })
    console.log(`▶️ Started OpenClaw for ${clientId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Start error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Remove OpenClaw completely for a client
 * @param {string} clientId - Unique client identifier
 * @returns {Promise<{success: boolean}>}
 */
export async function removeOpenClaw(clientId) {
  try {
    const sanitizedClientId = clientId.replace(/[^a-zA-Z0-9_-]/g, '')
    const commands = [
      `docker rm -f openclaw_${sanitizedClientId}`,
      `rm -rf /opt/chciai/openclaw-instances/${sanitizedClientId}`
    ]
    
    const command = `ssh ${VPS_USER}@${VPS_HOST} '${commands.join(' && ')}'`
    
    await execAsync(command, { timeout: 30000 })
    console.log(`🗑️ Removed OpenClaw for ${clientId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Remove error:', error)
    return { success: false, error: error.message }
  }
}
