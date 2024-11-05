# Tropical Summer Slash Ticketing System 🎟️

Welcome to the **Tropical Summer Slash Ticketing System** repository! This project is a comprehensive solution for creating, distributing, and managing event tickets with a focus on secure transactions and preventing ticket duplication.

## 🚀 Features

- **Secure Ticket Generation**: Create unique and tamper-proof tickets with embedded QR codes.
- **Automated Email Distribution**: Send generated tickets as PDFs directly to the purchaser's email.
- **Real-Time Ticket Management**: Track purchases and ensure each ticket can only be used once.
- **User-Friendly Interface**: React-based frontend that provides a seamless user experience.

## 🛠️ Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Firebase Cloud Functions, Supabase
- **PDF Generation**: PDFKit
- **Email Handling**: Nodemailer
- **Database**: Firebase Firestore for secure, Supabase database and scalable data handling

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/TriumphNdlovu/taquila-gang-events.git
cd tropical-summer-slash
```
### 2. Install Dependencies

```bash
npm install
```


### 3. Configure Environment Variables
Create a .env file in the root directory and add your environment variables:

```bash
# env

REACT_APP_SUPABASE_API_KEY=your_supabase_api_key
REACT_APP_SUPABASE_AUTH_DOMAIN=your_project_id.supabaseapp.com
REACT_APP_SUPABASE_PROJECT_ID=your_project_id
REACT_APP_EMAIL_USER=your_email_address
REACT_APP_EMAIL_PASSWORD=your_email_password
```
### 4. Run the Development Server

```bash

npm start
```

### 5. Deploy Firebase Functions (Optional)

``` bash
firebase deploy --only functions
```

## 🛡️ Security Measures
Security was a major focus to ensure that purchases were secure and ticket duplication was prevented:
- Unique Ticket IDs: Every ticket generated has a unique identifier.
- Validation Logic: Comprehensive backend checks to maintain data integrity.
- Encrypted QR Codes: Secure QR codes ensure that only valid tickets are accepted at the event.

## 🔧 Key Challenges & Solutions
**Challenge: Ensuring Secure Purchases**
Solution: Implemented unique ticket identifiers and backend validation to prevent duplication and unauthorized access.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please submit a pull request or open an issue.
## 📝 License
This project is licensed under the MIT License.
