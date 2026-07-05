const express = require("express");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const { Readable } = require("stream");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

function parseCSVBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer.toString());
    stream
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

function normalizeRow(row) {
  const keys = Object.keys(row);
  const find = (patterns) => {
    const k = keys.find((k) =>
      patterns.some((p) => k.toLowerCase().includes(p))
    );
    return k ? row[k] : null;
  };

  const costRaw =
    find(["cost", "amount", "charge", "total", "price", "spend"]) || "0";
  const cost = parseFloat(costRaw.replace(/[^0-9.-]/g, "")) || 0;

  return {
    service:
      find(["service", "product", "resource", "type"]) ||
      find(["description"]) ||
      "Unknown",
    cost,
    date:
      find(["date", "time", "period", "month", "day"]) ||
      new Date().toISOString().split("T")[0],
    region: find(["region", "location", "zone", "area"]) || "Global",
    account: find(["account", "project", "subscription", "owner"]) || "Default",
    category: find(["category", "group", "family", "class"]) || "General",
  };
}

function analyzeData(rows) {
  const normalized = rows.map(normalizeRow).filter((r) => r.cost >= 0);
  const totalCost = normalized.reduce((s, r) => s + r.cost, 0);

  // By service
  const byService = {};
  normalized.forEach(({ service, cost }) => {
    byService[service] = (byService[service] || 0) + cost;
  });

  // By date
  const byDate = {};
  normalized.forEach(({ date, cost }) => {
    const month = date.slice(0, 7);
    byDate[month] = (byDate[month] || 0) + cost;
  });

  // By region
  const byRegion = {};
  normalized.forEach(({ region, cost }) => {
    byRegion[region] = (byRegion[region] || 0) + cost;
  });

  // By account
  const byAccount = {};
  normalized.forEach(({ account, cost }) => {
    byAccount[account] = (byAccount[account] || 0) + cost;
  });

  const topServices = Object.entries(byService)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, cost]) => ({
      name,
      cost: parseFloat(cost.toFixed(2)),
      percentage: parseFloat(((cost / totalCost) * 100).toFixed(1)),
    }));

  const spendOverTime = Object.entries(byDate)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, cost]) => ({ date, cost: parseFloat(cost.toFixed(2)) }));

  const byRegionArr = Object.entries(byRegion)
    .sort((a, b) => b[1] - a[1])
    .map(([region, cost]) => ({
      region,
      cost: parseFloat(cost.toFixed(2)),
      percentage: parseFloat(((cost / totalCost) * 100).toFixed(1)),
    }));

  const byAccountArr = Object.entries(byAccount)
    .sort((a, b) => b[1] - a[1])
    .map(([account, cost]) => ({
      account,
      cost: parseFloat(cost.toFixed(2)),
    }));

  const recommendations = generateRecommendations(
    topServices,
    byRegionArr,
    spendOverTime,
    totalCost
  );

  return {
    summary: {
      totalCost: parseFloat(totalCost.toFixed(2)),
      totalRows: normalized.length,
      uniqueServices: Object.keys(byService).length,
      uniqueRegions: Object.keys(byRegion).length,
      avgMonthlySpend:
        spendOverTime.length > 0
          ? parseFloat(
              (
                spendOverTime.reduce((s, r) => s + r.cost, 0) /
                spendOverTime.length
              ).toFixed(2)
            )
          : 0,
      topService: topServices[0]?.name || "N/A",
    },
    topServices,
    spendOverTime,
    byRegion: byRegionArr,
    byAccount: byAccountArr,
    recommendations,
  };
}

function generateRecommendations(topServices, byRegion, spendOverTime, total) {
  const recs = [];

  // High-cost services
  topServices.slice(0, 3).forEach((svc) => {
    if (svc.percentage > 30) {
      recs.push({
        id: `svc-${svc.name}`,
        priority: "high",
        category: "Cost Spike",
        icon: "🔥",
        title: `${svc.name} is consuming ${svc.percentage}% of budget`,
        description: `This service accounts for $${svc.cost.toFixed(2)} of your total spend. Consider reviewing usage patterns, rightsizing resources, or exploring reserved instances.`,
        potentialSaving: parseFloat((svc.cost * 0.2).toFixed(2)),
        action: "Review & Rightsize",
      });
    } else if (svc.percentage > 15) {
      recs.push({
        id: `svc-opt-${svc.name}`,
        priority: "medium",
        category: "Optimization",
        icon: "⚡",
        title: `Optimize ${svc.name} usage`,
        description: `At ${svc.percentage}% of total spend ($${svc.cost.toFixed(2)}), there's an opportunity to optimize with reserved capacity or savings plans.`,
        potentialSaving: parseFloat((svc.cost * 0.15).toFixed(2)),
        action: "Explore Savings Plans",
      });
    }
  });

  // Multi-region spread
  if (byRegion.length > 3) {
    const topRegionCost = byRegion[0]?.cost || 0;
    const otherCost = byRegion.slice(1).reduce((s, r) => s + r.cost, 0);
    recs.push({
      id: "region-consolidation",
      priority: "medium",
      category: "Architecture",
      icon: "🌍",
      title: `Resources spread across ${byRegion.length} regions`,
      description: `You have workloads in ${byRegion.length} regions. Consolidating non-latency-sensitive workloads to fewer regions can reduce data transfer costs ($${(otherCost * 0.1).toFixed(2)} estimated savings).`,
      potentialSaving: parseFloat((otherCost * 0.1).toFixed(2)),
      action: "Consolidate Regions",
    });
  }

  // Spend trend
  if (spendOverTime.length >= 2) {
    const last = spendOverTime[spendOverTime.length - 1].cost;
    const prev = spendOverTime[spendOverTime.length - 2].cost;
    const change = ((last - prev) / prev) * 100;
    if (change > 20) {
      recs.push({
        id: "spend-spike",
        priority: "high",
        category: "Anomaly",
        icon: "📈",
        title: `${change.toFixed(0)}% month-over-month cost increase detected`,
        description: `Your most recent period shows a significant increase of $${(last - prev).toFixed(2)}. Set up billing alerts and investigate recently launched resources.`,
        potentialSaving: parseFloat(((last - prev) * 0.5).toFixed(2)),
        action: "Set Billing Alerts",
      });
    } else if (change < -10) {
      recs.push({
        id: "spend-drop",
        priority: "low",
        category: "Insight",
        icon: "📉",
        title: `Great job! Costs decreased ${Math.abs(change).toFixed(0)}%`,
        description: `Your spend dropped by $${(prev - last).toFixed(2)} compared to the previous period. Continue monitoring to sustain this trend.`,
        potentialSaving: 0,
        action: "Keep Monitoring",
      });
    }
  }

  // Reserved instances recommendation
  if (total > 500) {
    recs.push({
      id: "reserved-instances",
      priority: "high",
      category: "Commitment",
      icon: "💰",
      title: "Switch to Reserved Instances or Savings Plans",
      description: `With $${total.toFixed(2)} in total spend, committing to 1-year reserved instances for stable workloads could save up to 40% compared to on-demand pricing.`,
      potentialSaving: parseFloat((total * 0.35).toFixed(2)),
      action: "Analyze Commitments",
    });
  }

  // Idle resources
  recs.push({
    id: "idle-resources",
    priority: "medium",
    category: "Waste",
    icon: "🗑️",
    title: "Audit for idle and underutilized resources",
    description:
      "Industry data shows 30% of cloud resources are idle or severely underutilized. Run a utilization audit to identify stopped instances, unused volumes, and orphaned snapshots.",
    potentialSaving: parseFloat((total * 0.1).toFixed(2)),
    action: "Run Utilization Audit",
  });

  // Auto-scaling
  recs.push({
    id: "autoscaling",
    priority: "low",
    category: "Architecture",
    icon: "🔄",
    title: "Implement auto-scaling policies",
    description:
      "Configure auto-scaling groups to match capacity with demand. This prevents over-provisioning during off-peak hours and can reduce costs by 20-30%.",
    potentialSaving: parseFloat((total * 0.08).toFixed(2)),
    action: "Configure Auto-Scaling",
  });

  return recs.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });
}

// Routes
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.post("/api/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const rows = await parseCSVBuffer(req.file.buffer);
    if (rows.length === 0)
      return res.status(400).json({ error: "CSV file is empty or invalid" });

    const analysis = analyzeData(rows);
    res.json({ success: true, data: analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Analysis failed" });
  }
});

// Demo endpoint
app.get("/api/demo", (req, res) => {
  const demoRows = generateDemoData();
  const analysis = analyzeData(demoRows);
  res.json({ success: true, data: analysis });
});

function generateDemoData() {
  const services = [
    "EC2",
    "S3",
    "RDS",
    "Lambda",
    "CloudFront",
    "ECS",
    "ElastiCache",
    "Route 53",
  ];
  const regions = ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"];
  const rows = [];
  const months = [
    "2024-01",
    "2024-02",
    "2024-03",
    "2024-04",
    "2024-05",
    "2024-06",
  ];
  const baseCosts = {
    EC2: 1200,
    S3: 340,
    RDS: 890,
    Lambda: 45,
    CloudFront: 120,
    ECS: 560,
    ElastiCache: 280,
    "Route 53": 25,
  };

  months.forEach((month, mi) => {
    services.forEach((service) => {
      const base = baseCosts[service];
      const trend = 1 + mi * 0.05;
      const noise = 0.9 + Math.random() * 0.2;
      rows.push({
        service,
        cost: (base * trend * noise).toFixed(2),
        date: `${month}-01`,
        region: regions[Math.floor(Math.random() * regions.length)],
        account: Math.random() > 0.5 ? "Production" : "Staging",
      });
    });
  });

  return rows;
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
