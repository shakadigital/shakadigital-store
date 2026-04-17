import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { PaymentProofUpload } from "./payment-proof-upload"
import * as validation from "@/lib/validation"
import * as db from "@/lib/db"
import * as ordersActions from "@/lib/actions/orders"

// Mock the modules
vi.mock("@/lib/db", () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
      })),
    },
  },
}))

vi.mock("@/lib/actions/orders", () => ({
  uploadPaymentProof: vi.fn(),
}))

describe("PaymentProofUpload", () => {
  const mockOrderId = "test-order-123"
  const mockOnUploadSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render file input area", () => {
    render(<PaymentProofUpload orderId={mockOrderId} onUploadSuccess={mockOnUploadSuccess} />)

    expect(screen.getByText("Pilih file bukti transfer")).toBeDefined()
    expect(screen.getByText("JPG, PNG, atau PDF (max 5MB)")).toBeDefined()
  })

  it("should display upload button", () => {
    render(<PaymentProofUpload orderId={mockOrderId} onUploadSuccess={mockOnUploadSuccess} />)

    const uploadButton = screen.getByRole("button", { name: /upload bukti pembayaran/i })
    expect(uploadButton).toBeDefined()
  })

  it("should disable upload button when no file is selected", () => {
    render(<PaymentProofUpload orderId={mockOrderId} onUploadSuccess={mockOnUploadSuccess} />)

    const uploadButton = screen.getByRole("button", { name: /upload bukti pembayaran/i })
    expect(uploadButton.hasAttribute("disabled")).toBe(true)
  })

  it("should show error message for invalid file type", async () => {
    render(<PaymentProofUpload orderId={mockOrderId} onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/pilih file bukti transfer/i)
    const invalidFile = new File(["content"], "test.gif", { type: "image/gif" })

    fireEvent.change(fileInput, { target: { files: [invalidFile] } })

    await waitFor(() => {
      expect(screen.getByText(/format file tidak didukung/i)).toBeDefined()
    })
  })

  it("should show error message for file too large", async () => {
    render(<PaymentProofUpload orderId={mockOrderId} onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/pilih file bukti transfer/i)
    const largeContent = new Uint8Array(6 * 1024 * 1024) // 6MB
    const largeFile = new File([largeContent], "large.jpg", { type: "image/jpeg" })

    fireEvent.change(fileInput, { target: { files: [largeFile] } })

    await waitFor(() => {
      expect(screen.getByText(/ukuran file maksimal 5mb/i)).toBeDefined()
    })
  })

  it("should display selected file name when valid file is chosen", async () => {
    render(<PaymentProofUpload orderId={mockOrderId} onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/pilih file bukti transfer/i)
    const validFile = new File(["content"], "bukti-transfer.jpg", { type: "image/jpeg" })

    fireEvent.change(fileInput, { target: { files: [validFile] } })

    await waitFor(() => {
      expect(screen.getByText("bukti-transfer.jpg")).toBeDefined()
    })
  })

  it("should enable upload button when valid file is selected", async () => {
    render(<PaymentProofUpload orderId={mockOrderId} onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/pilih file bukti transfer/i)
    const validFile = new File(["content"], "bukti-transfer.jpg", { type: "image/jpeg" })

    fireEvent.change(fileInput, { target: { files: [validFile] } })

    await waitFor(() => {
      const uploadButton = screen.getByRole("button", { name: /upload bukti pembayaran/i })
      expect(uploadButton.hasAttribute("disabled")).toBe(false)
    })
  })

  it("should show success message after successful upload", async () => {
    // Mock successful upload
    const mockUpload = vi.fn().mockResolvedValue({ data: { path: "test-path" }, error: null })
    const mockGetPublicUrl = vi.fn().mockReturnValue({ data: { publicUrl: "https://example.com/file.jpg" } })
    
    vi.mocked(db.supabase.storage.from).mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
    } as any)

    vi.mocked(ordersActions.uploadPaymentProof).mockResolvedValue({ success: true })

    render(<PaymentProofUpload orderId={mockOrderId} onUploadSuccess={mockOnUploadSuccess} />)

    const fileInput = screen.getByLabelText(/pilih file bukti transfer/i)
    const validFile = new File(["content"], "bukti-transfer.jpg", { type: "image/jpeg" })

    fireEvent.change(fileInput, { target: { files: [validFile] } })

    await waitFor(() => {
      expect(screen.getByText("bukti-transfer.jpg")).toBeDefined()
    })

    const uploadButton = screen.getByRole("button", { name: /upload bukti pembayaran/i })
    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(screen.getByText(/bukti pembayaran berhasil diupload/i)).toBeDefined()
    })

    expect(mockOnUploadSuccess).toHaveBeenCalledTimes(1)
  })
})
