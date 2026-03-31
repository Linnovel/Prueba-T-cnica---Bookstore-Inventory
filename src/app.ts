import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { bookRouter } from "./routes/book.routes"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" })
})

app.use("/books", bookRouter)

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" })
})

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error)
  res.status(500).json({ message: "Internal server error" })
})

export { app }
