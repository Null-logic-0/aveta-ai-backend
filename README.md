Aveta AI Backend

A scalable and robust backend service for the Aveta AI platform built with NestJS and Node.js. It uses AWS S3 for file storage, EC2 for hosting, and PostgreSQL with TypeORM for database management. File uploads are handled via Multer, and API documentation is powered by Swagger.

🚀 Features

Built with NestJS and Node.js for modular and scalable architecture

Integration with AWS S3 for secure and efficient file storage

Hosted on AWS EC2 for reliable cloud infrastructure

Uses PostgreSQL with TypeORM ORM for database operations

File uploads managed with Multer middleware

API documented with Swagger UI for easy testing and exploration

RESTful API design with best practices


🛠️ Technology Stack

- Node.js
- Nest.js
- Mutler
- AWS S3 bucket
- AWS EC2
- TypeORM
- PostgreSQL

📦 Installation & Setup
Clone the repository:

    git clone https://github.com/Null-logic-0/aveta-ai-backend.git
    cd aveta-ai-backend

Install dependencies:

    npm install

Configure environment variables:

Create a .env file based on .env.example with:

PostgreSQL connection details

AWS credentials and S3 bucket info

Other relevant configuration such as port and JWT secrets

Start the development server:

    npm run start:dev

Access the Swagger UI API documentation at:

    http://localhost:3000/api

🧪 Running Tests
Run unit tests with:

    npm run test

📄 License

This project is licensed under the Apache License 2.0. See the LICENSE file for details.

🤝 Contribution

Contributions, issues, and feature requests are welcome! Feel free to fork the project and submit pull requests.

Aveta Backend

https://github.com/Null-logic-0/aveta-ai-backend

Aveta Frontend (app)

https://github.com/Null-logic-0/aveta-frontend

Aveta Frontend (Landing)

https://github.com/Null-logic-0/aveta-landing

Aveta Frontend (Admin)

https://admin.aveta.app/sign-in

