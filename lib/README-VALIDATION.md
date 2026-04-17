# Validation Utilities

This module provides validation utilities for the checkout flow feature.

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Supabase Storage

Run the SQL script to create the storage bucket and policies:

```sql
-- Run in Supabase SQL Editor
-- File: scripts/003-setup-storage.sql
```

Or manually in Supabase Dashboard:
1. Go to Storage section
2. Create a new bucket named `payment-proofs`
3. Set it to **Private** (not public)
4. Apply the policies from `scripts/003-setup-storage.sql`

## Modules

### `validation.ts`

Provides validation functions for form inputs and file uploads.

**Functions:**

- `validateEmail(email: string): ValidationResult`
  - Validates email format
  - Requirements: 1.3, 1.4

- `validateName(name: string): ValidationResult`
  - Validates name field (min 2 characters)
  - Requirements: 1.1, 1.4

- `validateFile(file: File): ValidationResult`
  - Validates file type (JPG, PNG, PDF) and size (max 5MB)
  - Requirements: 4.2, 4.3, 4.4

### `storage.ts`

Provides utilities for uploading files to Supabase Storage.

**Functions:**

- `uploadPaymentProofFile(orderId: string, file: File): Promise<UploadResult>`
  - Uploads payment proof to Supabase Storage
  - Returns public URL on success
  - Requirements: 4.5, 4.6, 4.7

### `types.ts`

Extended with checkout flow types:

- `ValidationErrors` - Form validation error messages
- `UploadProgress` - File upload progress tracking
- `BankAccount` - Bank account information structure

## Testing

### Run Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui
```

### Test Coverage

- **Unit Tests**: `lib/validation.test.ts`
  - 24 test cases covering all validation functions
  - Tests for edge cases, boundary values, and error conditions

## Usage Examples

### Email Validation

```typescript
import { validateEmail } from "@/lib/validation"

const result = validateEmail("user@example.com")
if (!result.valid) {
  console.error(result.error) // Display error message
}
```

### Name Validation

```typescript
import { validateName } from "@/lib/validation"

const result = validateName("John Doe")
if (!result.valid) {
  console.error(result.error)
}
```

### File Validation

```typescript
import { validateFile } from "@/lib/validation"

const handleFileSelect = (file: File) => {
  const result = validateFile(file)
  if (!result.valid) {
    alert(result.error)
    return
  }
  // Proceed with upload
}
```

### File Upload

```typescript
import { uploadPaymentProofFile } from "@/lib/storage"
import { uploadPaymentProof } from "@/lib/actions/orders"

const handleUpload = async (orderId: string, file: File) => {
  // Upload to storage
  const uploadResult = await uploadPaymentProofFile(orderId, file)
  
  if (!uploadResult.success) {
    alert(uploadResult.error)
    return
  }
  
  // Update order with proof URL
  const result = await uploadPaymentProof(orderId, uploadResult.publicUrl!)
  
  if (result.success) {
    alert("Bukti pembayaran berhasil diupload!")
  }
}
```

## File Structure

```
lib/
├── validation.ts           # Validation utilities
├── validation.test.ts      # Unit tests
├── storage.ts              # Storage utilities
├── types.ts                # TypeScript types (extended)
└── README-VALIDATION.md    # This file

scripts/
└── 003-setup-storage.sql   # Storage bucket setup
```

## Requirements Mapping

| Requirement | Module | Function |
|-------------|--------|----------|
| 1.1, 1.4 | validation.ts | validateName() |
| 1.3, 1.4 | validation.ts | validateEmail() |
| 4.2, 4.3, 4.4 | validation.ts | validateFile() |
| 4.5, 4.6, 4.7 | storage.ts | uploadPaymentProofFile() |

## Notes

- All validation functions return a `ValidationResult` object with `valid` boolean and optional `error` message
- File uploads use timestamp-based naming to prevent conflicts
- Storage bucket is private and requires authentication
- Maximum file size is 5MB
- Supported file types: JPG, JPEG, PNG, PDF
