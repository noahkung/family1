// server/routes.ts

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssessmentResponseSchema } from "@shared/schema"; // Zod schema
import { z } from "zod"; // for ZodError type

export async function registerRoutes(app: Express): Promise<Server> {
  // Assessment Routes
  app.post("/api/assessment/submit", async (req, res) => {
    try {
      // Zod validation will ensure req.body matches InsertAssessmentResponseSchema
      // This schema should reflect the 12 questions and strategyScore
      const validatedData = insertAssessmentResponseSchema.parse(req.body);
      const response = await storage.createAssessmentResponse(validatedData);
      res.json({ success: true, data: response });
    } catch (error) {
      console.error("Error submitting assessment:", error);
      // Provide more specific error message from Zod if it's a validation error
      if (error instanceof z.ZodError) { // Check if it's a Zod validation error
        return res.status(400).json({ 
          success: false, 
          error: "Validation failed: " + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(", ") 
        });
      }
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid assessment data" 
      });
    }
  });

  app.get("/api/assessment/responses", async (req, res) => {
    try {
      const responses = await storage.getAssessmentResponses();
      res.json({ success: true, data: responses });
    } catch (error) {
      console.error("Error fetching responses:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch assessment responses" 
      });
    }
  });

  app.get("/api/assessment/stats", async (req, res) => {
    try {
      const stats = await storage.getAssessmentStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch assessment statistics" 
      });
    }
  });

  app.delete("/api/assessment/responses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, error: "Invalid ID" });
      }
      
      const deleted = await storage.deleteAssessmentResponse(id);
      if (deleted) {
        res.json({ success: true, message: "Response deleted successfully" });
      } else {
        res.status(404).json({ success: false, error: "Response not found" });
      }
    } catch (error) {
      console.error("Error deleting response:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to delete response" 
      });
    }
  });

  app.delete("/api/assessment/responses", async (req, res) => {
    try {
      await storage.clearAllAssessmentResponses();
      res.json({ success: true, message: "All responses cleared successfully" });
    } catch (error) {
      console.error("Error clearing responses:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to clear responses" 
      });
    }
  });

  // Admin Authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          error: "Username and password are required" 
         });
      }

      const admin = await storage.getAdminUserByUsername(username);
      
      if (!admin || admin.password !== password) { // WARNING: In production, password should be hashed and compared securely
        return res.status(401).json({ 
          success: false, 
          error: "Invalid credentials" 
        });
      }

      // In a real app, you'd use proper session management
      res.json({ 
        success: true, 
        data: { username: admin.username, id: admin.id } 
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ 
        success: false, 
        error: "Login failed" 
      });
    }
  });

  // ===== START: MODIFIED BLOCK =====
  // Export data as CSV
  app.get("/api/assessment/export", async (req, res) => {
    try {
      const { includeUserName } = req.query;
      const includeUser = includeUserName === 'true';

      const responses = await storage.getAssessmentResponses();
      
      // Conditionally build headers and data rows
      const baseHeaders = ["ID", "Date", "Time", "Role"];
      const userHeader = includeUser ? ["User Name"] : [];
      const scoreHeaders = [
        ...Array.from({length: 12}, (_, i) => `Q${i+1} Score`),
        "Governance Score", "Legacy Score", "Relationships Score", "Strategy Score",
        "Overall Score",
      ];
      const headers = [...baseHeaders, ...userHeader, ...scoreHeaders];
      
      const csvContent = [
        headers.join(","),
        ...responses.map(response => {
            const baseData = [
                response.id,
                new Date(response.createdAt).toISOString().split('T')[0],
                new Date(response.createdAt).toISOString().split('T')[1].split('.')[0],
                response.role,
            ];
            const userData = includeUser ? [response.userName || ""] : [];
            const scoreData = [
                response.q1Score, response.q2Score, response.q3Score, response.q4Score,
                response.q5Score, response.q6Score, response.q7Score, response.q8Score,
                response.q9Score, response.q10Score, response.q11Score, response.q12Score,
                response.governanceScore,
                response.legacyScore,
                response.relationshipsScore,
                (response as any).strategyScore,
                response.overallScore,
            ];
            return [...baseData, ...userData, ...scoreData].join(",");
        })
      ].join("\n");

      const fileName = includeUser 
          ? 'family-business-assessment-data-with-users.csv'
          : 'family-business-assessment-data-anonymous.csv';

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(csvContent);
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to export data" 
      });
    }
  });
  // ===== END: MODIFIED BLOCK =====

  const httpServer = createServer(app);
  return httpServer;
}