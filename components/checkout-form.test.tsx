import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { CheckoutForm } from "./checkout-form"
import { useStore } from "@/lib/store"

// Mock the store
vi.mock("@/lib/store", () => ({
  useStore: vi.fn(),
}))

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

// Mock createOrder server action
vi.mock("@/lib/actions/orders", () => ({
  createOrder: vi.fn(),
}))

describe("CheckoutForm Component Structure", () => {
  const mockCart = [
    {
      product: {
        id: "1",
        title: "Test Product",
        price: 100000,
        vendorName: "Test Vendor",
        image: "/test.jpg",
        description: "Test description",
        category: "ebook" as const,
        vendorId: "vendor-1",
        downloads: 0,
        rating: 5,
        createdAt: "2024-01-01",
      },
      quantity: 1,
    },
  ]

  const mockOnOrderCreated = vi.fn()

  beforeEach(() => {
    // Mock useStore to return cart and null user (guest)
    vi.mocked(useStore).mockImplementation((selector: any) => {
      const state = {
        cart: mockCart,
        user: null,
        clearCart: vi.fn(),
      }
      return selector(state)
    })
  })

  it("should render buyer information section", () => {
    render(<CheckoutForm onOrderCreated={mockOnOrderCreated} />)
    
    expect(screen.getByText("Informasi Pembeli")).toBeInTheDocument()
    expect(screen.getByLabelText("Nama Lengkap")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
  })

  it("should render payment method section with bank options", () => {
    render(<CheckoutForm onOrderCreated={mockOnOrderCreated} />)
    
    expect(screen.getByText("Metode Pembayaran")).toBeInTheDocument()
    expect(screen.getByText("BCA")).toBeInTheDocument()
    expect(screen.getByText("Mandiri")).toBeInTheDocument()
    expect(screen.getByText("BNI")).toBeInTheDocument()
  })

  it("should render order items section", () => {
    render(<CheckoutForm onOrderCreated={mockOnOrderCreated} />)
    
    expect(screen.getByText("Produk yang Dibeli")).toBeInTheDocument()
    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText("Test Vendor")).toBeInTheDocument()
  })

  it("should render order summary card", () => {
    render(<CheckoutForm onOrderCreated={mockOnOrderCreated} />)
    
    expect(screen.getByText("Ringkasan Pembayaran")).toBeInTheDocument()
    expect(screen.getByText("Subtotal")).toBeInTheDocument()
    expect(screen.getByText("Biaya layanan")).toBeInTheDocument()
    expect(screen.getByText("Total")).toBeInTheDocument()
  })

  it("should render submit button disabled when form is empty", () => {
    render(<CheckoutForm onOrderCreated={mockOnOrderCreated} />)
    
    const submitButton = screen.getByRole("button", { name: "Buat Pesanan" })
    expect(submitButton).toBeInTheDocument()
    // Button should be disabled when form fields are empty (validation requirement 1.6)
    expect(submitButton).toBeDisabled()
  })

  it("should have initial state with empty buyer info", () => {
    render(<CheckoutForm onOrderCreated={mockOnOrderCreated} />)
    
    const nameInput = screen.getByLabelText("Nama Lengkap") as HTMLInputElement
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement
    
    expect(nameInput.value).toBe("")
    expect(emailInput.value).toBe("")
  })

  it("should have BCA selected as default bank", () => {
    render(<CheckoutForm onOrderCreated={mockOnOrderCreated} />)
    
    const bcaRadio = screen.getByRole("radio", { name: /BCA/i }) as HTMLInputElement
    expect(bcaRadio).toBeChecked()
  })
})

describe("CheckoutForm Authentication Integration", () => {
  const mockCart = [
    {
      product: {
        id: "1",
        title: "Test Product",
        price: 100000,
        vendorName: "Test Vendor",
        image: "/test.jpg",
        description: "Test description",
        category: "ebook" as const,
        vendorId: "vendor-1",
        downloads: 0,
        rating: 5,
        createdAt: "2024-01-01",
      },
      quantity: 1,
    },
  ]

  const mockOnOrderCreated = vi.fn()

  it("should auto-fill name and email for authenticated users", () => {
    // Mock authenticated user
    const mockUser = {
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
      avatar: "/avatar.jpg",
      role: "buyer" as const,
      purchases: [],
    }

    vi.mocked(useStore).mockImplementation((selector: any) => {
      const state = {
        cart: mockCart,
        user: mockUser,
        clearCart: vi.fn(),
      }
      return selector(state)
    })

    render(<CheckoutForm onOrderCreated={mockOnOrderCreated} />)
    
    const nameInput = screen.getByLabelText("Nama Lengkap") as HTMLInputElement
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement
    
    // Validates Requirement 5.1: Auto-fill name and email from session
    expect(nameInput.value).toBe("John Doe")
    expect(emailInput.value).toBe("john@example.com")
  })

  it("should allow manual input for guest users", () => {
    // Mock guest user (null)
    vi.mocked(useStore).mockImplementation((selector: any) => {
      const state = {
        cart: mockCart,
        user: null,
        clearCart: vi.fn(),
      }
      return selector(state)
    })

    render(<CheckoutForm onOrderCreated={mockOnOrderCreated} />)
    
    const nameInput = screen.getByLabelText("Nama Lengkap") as HTMLInputElement
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement
    
    // Validates Requirement 5.3: Guest users can manually input
    expect(nameInput.value).toBe("")
    expect(emailInput.value).toBe("")
  })

  it("should make auto-filled fields editable", () => {
    // Mock authenticated user
    const mockUser = {
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
      avatar: "/avatar.jpg",
      role: "buyer" as const,
      purchases: [],
    }

    vi.mocked(useStore).mockImplementation((selector: any) => {
      const state = {
        cart: mockCart,
        user: mockUser,
        clearCart: vi.fn(),
      }
      return selector(state)
    })

    render(<CheckoutForm onOrderCreated={mockOnOrderCreated} />)
    
    const nameInput = screen.getByLabelText("Nama Lengkap") as HTMLInputElement
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement
    
    // Validates Requirement 5.4: Auto-filled fields remain editable
    expect(nameInput).not.toBeDisabled()
    expect(emailInput).not.toBeDisabled()
  })
})

describe("CheckoutForm Order Summary Reactive Updates (Requirements 6.1, 6.5)", () => {
  const mockOnOrderCreated = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
  })

  const makeCart = (items: Array<{ id: string; title: string; vendorName: string; price: number }>) =>
    items.map((p) => ({
      product: {
        id: p.id,
        title: p.title,
        price: p.price,
        vendorName: p.vendorName,
        image: "/test.jpg",
        description: "Test description",
        category: "ebook" as const,
        vendorId: "vendor-1",
        downloads: 0,
        rating: 5,
        createdAt: "2024-01-01",
      },
      quantity: 1,
    }))

  it("should display product name, vendor name, and price for each cart item (Req 6.1)", () => {
    const cart = makeCart([
      { id: "1", title: "React Course", vendorName: "Code Academy", price: 500000 },
      { id: "2", title: "UI Template", vendorName: "Design Studio", price: 250000 },
    ])

    vi.mocked(useStore).mockImplementation((selector: any) =>
      selector({ cart, user: null, clearCart: vi.fn() })
    )

    render(<CheckoutForm onOrderCreated={mockOnOrderCreated} />)

    // Product names
    expect(screen.getByText("React Course")).toBeInTheDocument()
    expect(screen.getByText("UI Template")).toBeInTheDocument()
    // Vendor names
    expect(screen.getByText("Code Academy")).toBeInTheDocument()
    expect(screen.getByText("Design Studio")).toBeInTheDocument()
    // Prices (formatted as Rupiah)
    expect(screen.getByText("Rp 500.000")).toBeInTheDocument()
    expect(screen.getByText("Rp 250.000")).toBeInTheDocument()
  })

  it("should display subtotal, service fee, and grand total sections in order summary (Req 6.2-6.4)", () => {
    const cart = makeCart([
      { id: "item-a1", title: "Product A", vendorName: "Vendor A", price: 100000 },
    ])

    vi.mocked(useStore).mockImplementation((selector: any) =>
      selector({ cart, user: null, clearCart: vi.fn() })
    )

    render(<CheckoutForm onOrderCreated={mockOnOrderCreated} />)

    // Verify the summary section labels are present
    expect(screen.getByText("Subtotal")).toBeInTheDocument()
    expect(screen.getByText("Biaya layanan")).toBeInTheDocument()
    expect(screen.getByText("Total")).toBeInTheDocument()
  })

  it("should update order summary reactively when cart changes (Req 6.5)", () => {
    const singleItemCart = makeCart([
      { id: "item-solo1", title: "Solo Product", vendorName: "Solo Vendor", price: 200000 },
    ])

    vi.mocked(useStore).mockImplementation((selector: any) =>
      selector({ cart: singleItemCart, user: null, clearCart: vi.fn() })
    )

    const { rerender } = render(<CheckoutForm onOrderCreated={mockOnOrderCreated} />)

    // Initial state: only Solo Product visible
    expect(screen.getByText("Solo Product")).toBeInTheDocument()
    expect(screen.queryByText("New Product")).not.toBeInTheDocument()

    // Simulate cart update (add another item)
    const updatedCart = makeCart([
      { id: "item-solo1", title: "Solo Product", vendorName: "Solo Vendor", price: 200000 },
      { id: "item-new1", title: "New Product", vendorName: "New Vendor", price: 100000 },
    ])
    vi.mocked(useStore).mockImplementation((selector: any) =>
      selector({ cart: updatedCart, user: null, clearCart: vi.fn() })
    )

    rerender(<CheckoutForm onOrderCreated={mockOnOrderCreated} />)

    // After update: both items visible
    expect(screen.getByText("Solo Product")).toBeInTheDocument()
    expect(screen.getByText("New Product")).toBeInTheDocument()
    expect(screen.getByText("New Vendor")).toBeInTheDocument()

    // Summary section still present
    expect(screen.getByText("Subtotal")).toBeInTheDocument()
    expect(screen.getByText("Biaya layanan")).toBeInTheDocument()
    expect(screen.getByText("Total")).toBeInTheDocument()
  })
})
