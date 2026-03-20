export async function deriveKey(password: string, salt: BufferSource): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey'],
  )
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptText(text: string, password: string): Promise<string> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16))
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)

  const enc = new TextEncoder()
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(text),
  )

  const encryptedBytes = new Uint8Array(encrypted)
  const bundle = new Uint8Array(salt.length + iv.length + encryptedBytes.length)
  bundle.set(salt, 0)
  bundle.set(iv, salt.length)
  bundle.set(encryptedBytes, salt.length + iv.length)

  return `ENC:${btoa(String.fromCharCode(...bundle))}`
}

export async function decryptText(base64Bundle: string, password: string): Promise<string | null> {
  if (!base64Bundle.startsWith('ENC:'))
    return base64Bundle
  base64Bundle = base64Bundle.substring(4)

  try {
    const raw = atob(base64Bundle)
    const bundle = new Uint8Array(raw.length)
    for (let i = 0; i < raw.length; i++) {
      bundle[i] = raw.charCodeAt(i)
    }

    const salt = bundle.slice(0, 16)
    const iv = bundle.slice(16, 28)
    const ciphertext = bundle.slice(28)

    const key = await deriveKey(password, salt)
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext,
    )

    return new TextDecoder().decode(decrypted)
  }
  catch {
    return null
  }
}
