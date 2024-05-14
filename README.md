This basic NodeJs API allows users to scrape data from websites and store it in MongoDB.

env variables used:

- `DATABASE_URL=` the mongoDb url for connection
- `JWT_SECRET_KEY=` the secret for the jwt creation

Endpoints:

- `http://localhost:5000/api/auth/register` to register
- `http://localhost:5000/api/auth/login` to login
- `http://localhost:5000/api/crawl` to extract data from a URL
