import jsPDF from "jspdf";

interface Ticket {
  id: number;
  employee_name: string;
  role: string;
  start_date: string;
  hardware_tier: string;
  status: string;
  manager_status: string | null;
  finance_status: string | null;
  it_status: string | null;
  notes: string | null;
  job_description: string | null;
}

export function generateTicketPdf(ticket: Ticket) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageWidth, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("OnboardSync", 15, 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Employee Onboarding System", 15, 22);

  // Title
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`Onboarding Ticket #${ticket.id}`, 15, 45);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 15, 52);

  doc.setDrawColor(226, 232, 240);
  doc.line(15, 58, pageWidth - 15, 58);

  // Employee section
  let y = 68;
  doc.setTextColor(79, 70, 229);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("EMPLOYEE INFORMATION", 15, y);
  y += 8;

  const employeeFields = [
    ["Full Name", ticket.employee_name],
    ["Role", ticket.role],
    ["Start Date", ticket.start_date],
    ["Hardware Tier", ticket.hardware_tier],
  ];

  doc.setFontSize(10);
  employeeFields.forEach(([label, value]) => {
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(label, 15, y);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(String(value ?? "—"), 70, y);
    y += 7;
  });

  // Approval section
  y += 6;
  doc.setTextColor(79, 70, 229);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("APPROVAL STATUS", 15, y);
  y += 8;

  const approvalFields = [
    ["Current Status", ticket.status],
    ["Manager", ticket.manager_status ?? "—"],
    ["Finance", ticket.finance_status ?? "—"],
    ["IT", ticket.it_status ?? "—"],
  ];

  doc.setFontSize(10);
  approvalFields.forEach(([label, value]) => {
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(label, 15, y);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(String(value), 70, y);
    y += 7;
  });

  // Notes
  if (ticket.notes) {
    y += 6;
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("NOTES", 15, y);
    y += 7;
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const noteLines = doc.splitTextToSize(ticket.notes, pageWidth - 30);
    doc.text(noteLines, 15, y);
    y += noteLines.length * 5;
  }

  // Job description
  if (ticket.job_description) {
    y += 8;
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("JOB DESCRIPTION", 15, y);
    y += 7;
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const jdLines = doc.splitTextToSize(ticket.job_description, pageWidth - 30);
    doc.text(jdLines, 15, y);
  }

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text("OnboardSync · Confidential", 15, pageHeight - 9);
  doc.text(`Ticket #${ticket.id}`, pageWidth - 15, pageHeight - 9, { align: "right" });

  doc.save(`ticket-${ticket.id}-${ticket.employee_name.replace(/\s+/g, "-")}.pdf`);
}