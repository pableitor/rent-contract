# Airbnb Rental Contract Generator 🏠📄

A modern web tool to generate, export, and send personalized rental contracts from Airbnb reservation data.

**Live Demo:**  
👉 [https://pableitor.github.io/rent-contract/contract.html](https://pableitor.github.io/rent-contract/contract.html)

---

## ✨ Features

- 🔎 **Import Airbnb Booking Info**  
  Paste the data copied from an Airbnb reservation page and automatically fill in:
  - Guest name
  - Accommodation unit
  - Check-in and check-out dates

- 📄 **Generate PDF Contract**  
  Automatically fills a rental contract and converts it into a PDF ready to be signed or stored.

- ☁️ **Upload to AWS S3**  
  Upload the generated PDF to Amazon S3 and get a public download link.

- 📲 **Send via WhatsApp**  
  Share the contract instantly via WhatsApp with one click.

---

## 🚀 How to Use

1. Open the [contract form](https://pableitor.github.io/rent-contract/contract.html).
2. Enter the Airbnb reservation number or copy/paste the formatted text from a reservation page:
👤 Inquilino: John Doe
🏠 Alojamiento: Room 3 · Cozy downtown loft
📅 Fechas: 15 ago – 20 ago (5 noches)

3. Click **"📋 Paste from clipboard"** to autofill.
4. Review the form and press **"🖨️ Generate PDF"**.
5. Click **"📤 Upload PDF to S3"**.
6. Optionally, click **"📲 Send via WhatsApp"** with the guest's number.

---

## 🛠️ Tech Stack

- **HTML5 + JavaScript**
- **AWS S3** for file hosting
- **Clipboard API** to import Airbnb data
- **html2pdf.js** for client-side PDF generation
- **WhatsApp Web link sharing**

---

## 📁 Files

- `contract.html` – Main interactive form 
- `scripts.js` – Handles the button behaviours
- `style.css` –  Custom styles
- `README.md` – This file

---

## 📦 Deployment

To host your own version:

1. Fork or clone this repo
2. Replace `awsConfig` with your own S3 credentials (`scripts.js`)
3. Deploy to GitHub Pages or your preferred static host

---

## 📝 License

MIT License. Feel free to copy, fork, improve, or adapt it for your own needs.

---

## 🙌 Credits

Made with 💻 and ☕ by [pableitor](https://github.com/pableitor)
