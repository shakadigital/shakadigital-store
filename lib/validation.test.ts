import { describe, it, expect } from "vitest"
import { validateEmail, validateName, validateFile } from "./validation"

describe("validateEmail", () => {
  it("should reject empty email", () => {
    const result = validateEmail("")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Email wajib diisi")
  })

  it("should reject whitespace-only email", () => {
    const result = validateEmail("   ")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Email wajib diisi")
  })

  it("should reject invalid email format - missing @", () => {
    const result = validateEmail("invalidemail.com")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Format email tidak valid")
  })

  it("should reject invalid email format - missing domain", () => {
    const result = validateEmail("invalid@")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Format email tidak valid")
  })

  it("should reject invalid email format - missing TLD", () => {
    const result = validateEmail("invalid@domain")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Format email tidak valid")
  })

  it("should accept valid email", () => {
    const result = validateEmail("test@example.com")
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("should accept valid email with subdomain", () => {
    const result = validateEmail("user@mail.example.com")
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })
})

describe("validateName", () => {
  it("should reject empty name", () => {
    const result = validateName("")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Nama lengkap wajib diisi")
  })

  it("should reject whitespace-only name", () => {
    const result = validateName("   ")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Nama lengkap wajib diisi")
  })

  it("should reject name with less than 2 characters", () => {
    const result = validateName("A")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Nama minimal 2 karakter")
  })

  it("should reject name with 1 character after trim", () => {
    const result = validateName("  A  ")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Nama minimal 2 karakter")
  })

  it("should accept name with exactly 2 characters", () => {
    const result = validateName("Ab")
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("should accept valid name", () => {
    const result = validateName("John Doe")
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("should accept name with leading/trailing spaces", () => {
    const result = validateName("  John Doe  ")
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })
})

describe("validateFile", () => {
  it("should reject unsupported file type - GIF", () => {
    const file = new File(["content"], "test.gif", { type: "image/gif" })
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Format file tidak didukung. Gunakan JPG, PNG, atau PDF.")
  })

  it("should reject unsupported file type - video", () => {
    const file = new File(["content"], "test.mp4", { type: "video/mp4" })
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Format file tidak didukung. Gunakan JPG, PNG, atau PDF.")
  })

  it("should reject unsupported file type - text", () => {
    const file = new File(["content"], "test.txt", { type: "text/plain" })
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Format file tidak didukung. Gunakan JPG, PNG, atau PDF.")
  })

  it("should reject file larger than 5MB", () => {
    const largeContent = new Uint8Array(6 * 1024 * 1024) // 6MB
    const file = new File([largeContent], "large.jpg", { type: "image/jpeg" })
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Ukuran file maksimal 5MB.")
  })

  it("should accept JPEG file", () => {
    const file = new File(["content"], "test.jpeg", { type: "image/jpeg" })
    const result = validateFile(file)
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("should accept JPG file", () => {
    const file = new File(["content"], "test.jpg", { type: "image/jpg" })
    const result = validateFile(file)
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("should accept PNG file", () => {
    const file = new File(["content"], "test.png", { type: "image/png" })
    const result = validateFile(file)
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("should accept PDF file", () => {
    const file = new File(["content"], "test.pdf", { type: "application/pdf" })
    const result = validateFile(file)
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("should accept file exactly at 5MB limit", () => {
    const content = new Uint8Array(5 * 1024 * 1024) // Exactly 5MB
    const file = new File([content], "limit.jpg", { type: "image/jpeg" })
    const result = validateFile(file)
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it("should accept small valid file", () => {
    const content = new Uint8Array(100 * 1024) // 100KB
    const file = new File([content], "small.png", { type: "image/png" })
    const result = validateFile(file)
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })
})
