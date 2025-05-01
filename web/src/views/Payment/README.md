# Payment Component

This component handles the payment process for orders in the e-commerce application. It allows users to select a payment method, provide payment details, and submit their order.

## Features

- Display bank account information for transfers
- Select payment method (Bank Transfer, Mobile Payment)
- Upload payment receipt
- Enter shipping information
- View order summary
- Process payment and create order

## Files

- `Payment.vue`: The Vue template for the payment page
- `Payment.js`: The JavaScript logic for the payment component
- `Payment.scss`: The styling for the payment component

## Usage

The Payment component is used as a page in the application's router. It expects to receive checkout data from localStorage, which should be set by the previous checkout step.

### Checkout Data Format

The checkout data should be stored in localStorage with the key `checkoutData` and have the following format:

```javascript
{
  items: [
    {
      id: 1,
      name: "Product Name",
      brand: "Brand Name",
      price: 10.99,
      quantity: 2,
      image: "/path/to/image.jpg"
    }
  ],
  total: 21.98,
  coupon: {
    code: "DISCOUNT10",
    discount: 2.20
  }
}
```

## Authentication

The component requires the user to be authenticated to process payments. It uses the `useAuth` composable to get the user's token and ID.

## API Endpoints

The component interacts with the following API endpoints:

- `GET /metodos-pago`: Get available payment methods
- `GET /bancos`: Get available banks
- `POST /ordenes`: Create a new order
- `POST /pagos`: Process payment for an order
- `POST /coupons/apply`: Apply a coupon to an order

## Form Validation

The form validates that all required fields are filled before enabling the submit button:

- Payment method
- Bank (if payment method is bank transfer)
- Reference number
- Payment receipt file
- Shipping information (name, address, city, state, phone)

## Testing

Tests for this component are located in the `__tests__` directory. Note that a testing framework needs to be set up to run these tests.

## Styling

The component uses SCSS for styling and is responsive for both desktop and mobile views.

## Dependencies

- Vue 3
- Vue Router
- Lucide Vue (for icons)
- API Service
- Cart Service
- Coupon Service
- Toast Service
- Dolar Store (for currency conversion)
- Auth Composable