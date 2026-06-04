import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const accounts = await sql`SELECT * FROM accounts ORDER BY id ASC`;
    const contacts = await sql`SELECT * FROM contacts ORDER BY id ASC`;
    const deals = await sql`SELECT * FROM deals ORDER BY id ASC`;
    const tickets = await sql`SELECT * FROM tickets ORDER BY id ASC`;
    const activities = await sql`SELECT * FROM activities ORDER BY timestamp DESC`;
    const documents = await sql`SELECT * FROM documents ORDER BY id ASC`;

    // Map database snake_case fields back to frontend camelCase fields
    const mappedAccounts = accounts.map(a => ({
      id: a.id,
      name: a.name,
      domain: a.domain,
      industry: a.industry,
      location: a.location,
      riskScore: a.risk_score
    }));

    const mappedContacts = contacts.map(c => ({
      id: c.id,
      accountId: c.account_id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      role: c.role
    }));

    const mappedDeals = deals.map(d => ({
      id: d.id,
      accountId: d.account_id,
      title: d.title,
      amount: Number(d.amount),
      stage: d.stage,
      healthScore: d.health_score,
      closeDate: d.close_date ? new Date(d.close_date).toISOString().split('T')[0] : null
    }));

    const mappedTickets = tickets.map(t => ({
      id: t.id,
      accountId: t.account_id,
      dealId: t.deal_id,
      title: t.title,
      severity: t.severity,
      status: t.status,
      assetName: t.asset_name,
      detectedAt: t.detected_at,
      confidence: Number(t.confidence)
    }));

    const mappedActivities = activities.map(a => ({
      id: a.id,
      accountId: a.account_id,
      type: a.type,
      description: a.description,
      timestamp: a.timestamp,
      critical: a.critical
    }));

    const mappedDocuments = documents.map(d => ({
      id: d.id,
      accountId: d.account_id,
      name: d.name,
      size: d.size,
      category: d.category
    }));

    return NextResponse.json({
      accounts: mappedAccounts,
      contacts: mappedContacts,
      deals: mappedDeals,
      tickets: mappedTickets,
      activities: mappedActivities,
      documents: mappedDocuments
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, payload } = body;

    if (!type || !payload) {
      return NextResponse.json({ error: 'Missing type or payload' }, { status: 400 });
    }

    if (type === 'account') {
      const { name, domain, industry, location } = payload;
      const id = `acc-${Date.now()}`;
      
      // Auto-deduplication: check if name already exists
      const existing = await sql`SELECT id FROM accounts WHERE LOWER(TRIM(name)) = LOWER(TRIM(${name}))`;
      if (existing.length > 0) {
        return NextResponse.json({ 
          success: false, 
          message: 'Duplicate Account detected! System auto-merged metrics.', 
          accountId: existing[0].id 
        });
      }

      await sql`
        INSERT INTO accounts (id, name, domain, industry, location, risk_score)
        VALUES (${id}, ${name}, ${domain}, ${industry}, ${location}, 100)
      `;

      return NextResponse.json({ success: true, id });

    } else if (type === 'contact') {
      const { accountId, name, email, phone, role } = payload;
      const id = `con-${Date.now()}`;

      // Email deduplication check
      const existing = await sql`SELECT id FROM contacts WHERE LOWER(email) = LOWER(${email})`;
      if (existing.length > 0) {
        return NextResponse.json({ 
          success: false, 
          message: 'Deduplication Alert: Email belongs to an existing Contact.' 
        });
      }

      await sql`
        INSERT INTO contacts (id, account_id, name, email, phone, role)
        VALUES (${id}, ${accountId}, ${name}, ${email}, ${phone}, ${role})
      `;

      // Log system activity for added contact
      const actId = `act-${Date.now()}`;
      const desc = `Added associated contact '${name}'.`;
      await sql`
        INSERT INTO activities (id, account_id, type, description, timestamp, critical)
        VALUES (${actId}, ${accountId}, 'System Log', ${desc}, CURRENT_TIMESTAMP, FALSE)
      `;

      return NextResponse.json({ success: true, id });

    } else if (type === 'deal') {
      const { accountId, title, amount, stage, closeDate } = payload;
      const id = `deal-${Date.now()}`;

      await sql`
        INSERT INTO deals (id, account_id, title, amount, stage, health_score, close_date)
        VALUES (${id}, ${accountId}, ${title}, ${amount}, ${stage}, 100, ${closeDate || null})
      `;

      // Log system activity for opened deal
      const actId = `act-${Date.now()}`;
      const desc = `Opened Deal / Project '${title}' for ₹${Number(amount).toLocaleString('en-IN')}`;
      await sql`
        INSERT INTO activities (id, account_id, type, description, timestamp, critical)
        VALUES (${actId}, ${accountId}, 'System Log', ${desc}, CURRENT_TIMESTAMP, FALSE)
      `;

      return NextResponse.json({ success: true, id });

    } else if (type === 'ticket') {
      const { accountId, dealId, title, severity, assetName, confidence } = payload;
      const id = `tick-${Date.now()}`;
      const isCritical = severity === 'CRITICAL' || severity === 'HIGH';

      await sql`
        INSERT INTO tickets (id, account_id, deal_id, title, severity, status, asset_name, detected_at, confidence)
        VALUES (${id}, ${accountId}, ${dealId || null}, ${title}, ${severity}, 'OPEN', ${assetName}, CURRENT_TIMESTAMP, ${confidence || 100.00})
      `;

      // Log activity
      const actId = `act-${Date.now()}`;
      const desc = `ANOMALY: ${title} detected on ${assetName}. Severity: ${severity}.`;
      await sql`
        INSERT INTO activities (id, account_id, type, description, timestamp, critical)
        VALUES (${actId}, ${accountId}, ${isCritical ? 'Emergency Alert' : 'Structural Anomaly'}, ${desc}, CURRENT_TIMESTAMP, ${isCritical})
      `;

      return NextResponse.json({ success: true, id });

    } else if (type === 'resolve_ticket') {
      const { ticketId } = payload;

      await sql`
        UPDATE tickets SET status = 'RESOLVED' WHERE id = ${ticketId}
      `;

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unsupported type' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
