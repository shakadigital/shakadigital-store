# Implementation Plan: Checkout Flow

## Overview

Implementasi fitur Checkout Flow untuk ShakaDigital Store yang memungkinkan buyer menyelesaikan pembelian produk digital melalui proses multi-step: validasi form, pembuatan order, konfirmasi, dan upload bukti pembayaran. Implementasi menggunakan Next.js 15 App Router, TypeScript, Supabase, dan Zustand untuk state management.

## Tasks

- [x] 1. Setup Supabase Storage dan validation utilities
  - Create Supabase Storage bucket `payment-proofs` dengan policies
  - Implement validation utilities: `validateEmail()`, `validateName()`, `validateFile()`
  - Create TypeScript types untuk validation errors dan upload progress
  - _Requirements: 1.3, 1.4, 4.2, 4.3, 4.4_

- [ ]* 1.1 Write property test for email validation
  - **Property 1: Input validation rejects invalid data**
  - **Validates: Requirements 1.3, 1.4**

- [x] 2. Implement calculation utilities dan order summary logic
  - Create functions: `calculateSubtotal()`, `calculateServiceFee()`, `calculateGrandTotal()`
  - Implement service fee calculation dengan 5% rounding menggunakan `Math.round()`
  - Add memoization untuk optimasi performa
  - _Requirements: 6.2, 6.3, 6.4_

- [ ]* 2.1 Write property tests for calculation logic
  - **Property 18: Subtotal calculation is accurate**
  - **Property 19: Service fee calculation is correct**
  - **Property 20: Grand total calculation is accurate**
  - **Validates: Requirements 6.2, 6.3, 6.4**

- [x] 3. Create server action `getOrderById()`
  - Implement new server action di `lib/actions/orders.ts`
  - Query orders table dengan join ke order_items
  - Return order details dengan items array
  - Handle error cases dan return structured response
  - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [ ]* 3.1 Write unit tests for getOrderById
  - Test successful order retrieval
  - Test order not found scenario
  - Test database error handling
  - _Requirements: 3.2_

- [ ] 4. Implement CheckoutForm component dengan validation
  - [x] 4.1 Create CheckoutForm component structure
    - Setup component state: buyerName, buyerEmail, selectedBank, errors, isSubmitting
    - Implement form fields: name input, email input, bank selection radio group
    - Add order items display dan order summary card
    - _Requirements: 1.1, 1.2, 6.1_

  - [x] 4.2 Implement client-side form validation
    - Add validation on blur untuk name dan email fields
    - Implement real-time error clearing ketika user memperbaiki input
    - Disable submit button ketika ada validation errors
    - Prevent form submission dengan invalid data
    - _Requirements: 1.5, 1.6, 1.7_

  - [ ]* 4.3 Write property tests for form validation
    - **Property 2: Form state reflects validation status**
    - **Property 3: Client-side validation precedes server calls**
    - **Validates: Requirements 1.5, 1.6, 1.7**

  - [x] 4.4 Implement authentication integration
    - Auto-fill name dan email dari Supabase Auth session untuk authenticated users
    - Allow manual input untuk guest users
    - Make auto-filled fields editable
    - Include userId dalam createOrder call untuk authenticated users
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 4.5 Write property tests for authentication integration
    - **Property 14: Authenticated users have auto-filled form with userId**
    - **Property 15: Guest users submit without userId**
    - **Property 16: Auto-filled fields remain editable**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

  - [x] 4.6 Implement order creation flow
    - Call `createOrder()` server action dengan validated data
    - Handle loading state dengan disabled button dan loading indicator
    - Store returned orderId dalam component state
    - Clear cart menggunakan Zustand store pada successful order
    - Display error message jika createOrder gagal tanpa clear cart
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]* 4.7 Write property tests for order creation
    - **Property 4: Order creation receives correct parameters**
    - **Property 5: Successful order creation updates state correctly**
    - **Property 6: Failed order creation preserves cart state**
    - **Property 7: Async operations show loading state**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement ConfirmationView component
  - [x] 6.1 Create ConfirmationView component structure
    - Setup component props: orderId, grandTotal, selectedBank, orderItems
    - Display order ID dan order summary
    - Show payment instructions dengan bank account details
    - Add navigation buttons: "Lihat Status Pesanan" dan "Lanjut Belanja"
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 6.2 Write property test for confirmation display
    - **Property 8: Confirmation displays complete order information**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5**

  - [x] 6.3 Implement PaymentProofUpload component
    - Create file input dengan accept JPG, PNG, PDF
    - Implement client-side file validation (type dan size)
    - Display validation error messages
    - Show upload progress indicator
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.9, 4.10_

  - [ ]* 6.4 Write property test for file validation
    - **Property 10: File validation enforces type and size constraints**
    - **Validates: Requirements 4.2, 4.3, 4.4**

  - [x] 6.5 Implement file upload to Supabase Storage
    - Upload file ke bucket `payment-proofs` dengan path `{orderId}/{timestamp}-{filename}`
    - Get public URL dari uploaded file
    - Call `uploadPaymentProof()` server action dengan orderId dan URL
    - Handle upload success: display success message, hide upload component
    - Handle upload failure: display error message, allow retry
    - _Requirements: 4.5, 4.6, 4.7, 4.8_

  - [ ]* 6.6 Write property tests for upload flow
    - **Property 11: File upload follows correct path pattern**
    - **Property 12: Successful upload completes workflow**
    - **Property 13: Failed upload enables retry**
    - **Validates: Requirements 4.5, 4.6, 4.7, 4.8**

- [ ] 7. Integrate CheckoutForm dan ConfirmationView di checkout page
  - [x] 7.1 Update app/checkout/page.tsx
    - Implement view state management: "form" atau "confirmation"
    - Conditionally render CheckoutForm atau ConfirmationView
    - Handle view transition setelah successful order creation
    - Redirect ke /cart jika cart kosong dan tidak ada active order
    - _Requirements: 3.1, 3.8_

  - [ ]* 7.2 Write property test for view transitions
    - **Property 9: View transitions follow order creation success**
    - **Validates: Requirements 3.1**

  - [x] 7.3 Implement order summary reactive updates
    - Connect calculation utilities ke cart state
    - Update subtotal, service fee, grand total ketika cart berubah
    - Display all cart items dengan product name, vendor name, price
    - _Requirements: 6.1, 6.5_

  - [ ]* 7.4 Write property test for order summary
    - **Property 17: Cart items render completely**
    - **Property 21: Order summary updates reactively**
    - **Validates: Requirements 6.1, 6.5**

- [x] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional dan dapat di-skip untuk faster MVP
- Setiap task mereferensikan specific requirements untuk traceability
- Property tests memvalidasi universal correctness properties dari design
- Unit tests memvalidasi specific examples dan edge cases
- Implementasi menggunakan TypeScript, Next.js 15 App Router, dan Supabase
- File upload menggunakan Supabase Storage dengan bucket `payment-proofs`
- Calculation logic menggunakan Math.round() untuk service fee 5%
