# Next.js Authentication App

Explore a Next.js application designed to seamlessly integrate user authentication, providing a secure and intuitive user experience. This repository contains a fully functional Next.js project featuring a robust authentication system, complete with login, logout, and signup functionalities. Utilizing modern technologies such as Axios for API requests and react-hot-toast for elegant notifications, this app showcases best practices in handling user sessions and protecting routes.

## Key Features

- **Secure Authentication Flow**: Implementing a streamlined login and signup process, ensuring user credentials are handled securely. Passwords are encrypted using `bcryptjs` before storing in the database.
- **Email Confirmation**: Utilizing `Nodemailer` and `Mailtrap` to send email confirmations during the signup process, enhancing security and user verification.
- **Session Management**: Efficiently managing user sessions, with seamless integration of logout functionality to ensure user data protection.
- **Interactive UI**: Leveraging Tailwind CSS for a beautifully designed, responsive user interface that enhances usability and user engagement.
- **Client-Side Navigation**: Utilizing Next.js's built-in routing capabilities to provide a smooth, SPA-like experience across the authentication pages.
- **Toast Notifications**: Integrating `react-hot-toast` to display informative success and error messages, improving the overall user interaction.
- **Profile Management**: A dedicated profile page that allows users to view their details, reinforcing the app's authentication capabilities.
- **Data Storage**: Using MongoDB Atlas as the database solution for storing user details securely and efficiently.

Whether you're looking to implement authentication in your Next.js project or seeking inspiration for creating engaging user interfaces with Tailwind CSS, this repository offers valuable insights and practical code examples. Dive into the code to discover how to build secure, scalable, and user-friendly web applications with Next.js.

## Screenshots
- Sign Up
  ![tuxpi com 1712470719](https://github.com/RAVIGANESHMBHAT/NextJS-Authentication/assets/41186067/75e42e47-e09f-4178-9830-6f51dd757839)

- Verify Email
  ![tuxpi com 1712472322](https://github.com/RAVIGANESHMBHAT/NextJS-Authentication/assets/41186067/4d8c5b0b-d904-4d69-ad78-77dc39db1b48)

- Successful Email Verification
![tuxpi com 1712474775](https://github.com/RAVIGANESHMBHAT/NextJS-Authentication/assets/41186067/230897ea-56a3-4564-a642-0fde4d355fe8)

- Failed to Verify Email
 ![tuxpi com 1712474721](https://github.com/RAVIGANESHMBHAT/NextJS-Authentication/assets/41186067/77edc349-b923-4f88-988f-f6ad51190296)

- Login
  ![tuxpi com 1712470649](https://github.com/RAVIGANESHMBHAT/NextJS-Authentication/assets/41186067/8de32408-99f8-4a2c-8847-50fef069897e)

- Profile
  ![tuxpi com 1712470785](https://github.com/RAVIGANESHMBHAT/NextJS-Authentication/assets/41186067/e1475e48-f55f-44e4-b141-8a745ae43845)

- Profile Details
  ![tuxpi com 1712470849](https://github.com/RAVIGANESHMBHAT/NextJS-Authentication/assets/41186067/0b0cb8e3-e77e-41e9-81bf-71c51ceca81f)

- Home Page which can be accessed after successful login
  ![tuxpi com 1712470887](https://github.com/RAVIGANESHMBHAT/NextJS-Authentication/assets/41186067/4d61665f-b48b-4a9e-9009-90a8d449923d)

- Toast message on the top
![tuxpi com 1712471311](https://github.com/RAVIGANESHMBHAT/NextJS-Authentication/assets/41186067/dd70a8ef-e7ef-405b-89ba-4107d0b9e7a7)

## Getting Started

To get a local copy up and running follow these simple steps.
1. Clone the repo
```bash
git clone https://github.com/RAVIGANESHMBHAT/NextJS-Authentication.git
```

2. Go to the project folder
```bash
cd NextJS-Authentication
```

3. Install NPM packages
```bash
npm install
```
or
```bash
yarn install
```

4. Create `.env` file and enter valid data. (Refer to `.env.sample` file)

5. Run the development server
```bash
npm run dev
```
or
```bash
yarn dev
```

## Useful links
- NextJS - https://nextjs.org/docs/getting-started/installation
- Mailtrap - https://mailtrap.io/signin
- Nodemailer - https://www.nodemailer.com/
- MongoDb Atlas - https://www.mongodb.com/cloud/atlas/register


Busines Logics
PARAMETERS
- Rout = {origin_country: country_name, destination_country: country_name}
- Options = [Express Door to door, Express Warehouse to Door, Fast Track, Consol, Sea]
- Goods category = Has Battery, Has No battery, Contains food stuff,
- import_rate_kg = dbValue
- export_rate_kg = dbValue
- Import_extra_half_kg_rate = dbValue
- export_extra_half_kg_rate = dbValue
- import_rate = dbValue
- weight = dbValue
- VAT = dbValue
- sub_charge = dbValue
- exchange_rate = dbValue





{
  _id: ObjectId,
  name: "United Kingdom", // country name
  code: "UK",             // optional ISO code

  export: {
    // Nigeria → UK (export)
    availableOptions: ["Express", "Fast Track", "Console", "Sea"],
    allowedGoods: ["Has Battery", "No Battery", "Contains Food Stuff"]
    kgRates: {
      "0.5": 10.0,
      "1.0": 18.0,
      "1.5": 26.0,
      "2.0": 33.0,
      "2.5": 40.0,
      "3.0": 47.0,
      "3.5": 54.0,
      "4.0": 61.0,
      "4.5": 68.0,
      "5.0": 75.0
    },
    extraHalfKgRate: 6.0,
    subChargePercent: 10,
    vatPercent: 7.5,
    exchangeRate: 1200, // for converting to Naira,
    fastTrackRate: {
      "1-5kg": "75000",
      "6-10kg": "150000",
      "above10kg": "9000",
    },
    consoleRate: {
      "1-5kg": "75000",
      "6-10kg": "150000",
      "above10kg": "9000",
    },
    seaRate: 320,
    20ftRate: 200,
    40ftRate: 400,
    customClearanceRate: 250,
    
  },

  import: {
    // UK → Nigeria (import)
    availableOptions: ["Express", "Fast Track", "Console", "Sea"],
    allowedGoods: ["Has Battery", "No Battery", "Contains Food Stuff"],
    kgRates: {
      "0.5": 12.0,
      "1.0": 21.0,
      "1.5": 30.0,
      "2.0": 38.0,
      "2.5": 45.0,
      "3.0": 52.0,
      "3.5": 59.0,
      "4.0": 66.0,
      "4.5": 73.0,
      "5.0": 80.0
    },
    extraHalfKgRate: 7.0,
    subChargePercent: 12,
    vatPercent: 8,
    exchangeRate: 1200,
    fastTrackRate: {
      "1-5kg": "75000",
      "6-10kg": "150000",
      "above10kg": "9000",
    },
    consoleRate: {
      "1-5kg": "75000",
      "6-10kg": "150000",
      "above10kg": "9000",
    },
    seaRate: 300,
    20ftRate: 200,
    40ftRate: 400,
    customClearanceRate: 250,
  }
}


function calculateExpressShippingRate(route, option, weight, goods_category) {
  const isExport = route.origin_country === 'Nigeria';
  const isImport = route.destination_country === 'Nigeria';

  const country_key = isExport ? route.destination_country : route.origin_country;
  
  // Fetch rates for the route, category, and option from DB
  const base_rates_0_5kg = getRatesUpTo5Kg(country_key, option, goods_category); // Array of 0.5kg steps [rate_0.5kg, rate_1kg, ..., rate_5kg]
  const extra_half_kg_rate = getExtraHalfKgRate(country_key, option, goods_category); // flat rate after 5kg
  const vat = getVAT(country_key);
  const sub_charge = getSubCharge(country_key);
  const exchange_rate = getExchangeRate(country_key);

  let total = 0;

  if (weight <= 5) {
    // Find the correct 0.5kg slab (e.g., 1.5kg = index 2 => base_rates_0_5kg[2])
    const slabIndex = Math.ceil(weight / 0.5) - 1;
    const base_rate = base_rates_0_5kg[slabIndex];

    const sub = base_rate * sub_charge;
    const vat_amount = base_rate * vat;

    total = (base_rate + sub + vat_amount) * exchange_rate;
  } else {
    // Calculate for the first 5kg
    const base_rate_5kg = base_rates_0_5kg[9]; // index for 5kg
    const sub_5kg = base_rate_5kg * sub_charge;
    const vat_5kg = base_rate_5kg * vat;
    const total_5kg = (base_rate_5kg + sub_5kg + vat_5kg);

    // Calculate extra half kg blocks after 5kg
    const extra_weight = weight - 5;
    const extra_blocks = Math.ceil(extra_weight / 0.5);
    const extra_rate_total = extra_blocks * (extra_half_kg_rate + (extra_half_kg_rate * sub_charge) + (extra_half_kg_rate * vat));

    total = (total_5kg + extra_rate_total) * exchange_rate;
  }

  return total;
}



ToDO
- update database with model
- create a form component for handling data per country
- 