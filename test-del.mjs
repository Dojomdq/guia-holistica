const P = "https://www.guiadebienestar.com.ar";

async function test() {
  // Login
  const lr = await fetch(P + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: "admin", pass: "guia2026" }),
  });
  const token = lr.headers.get("set-cookie")?.split(";")[0].split("=").slice(1).join("");
  const auth = { Cookie: "admin_auth=" + token };

  // List destacados
  console.log("--- Destacados en producción ---");
  const list = await fetch(P + "/api/destacados", { headers: auth });
  const data = await list.json();
  console.log(JSON.stringify(data, null, 2));

  // Find Eduardo Palermo
  const eduardo = data.find(d => {
    const name = d.facilitadores?.nombre?.toLowerCase() || "";
    return name.includes("eduardo") || name.includes("palermo");
  });

  if (eduardo) {
    console.log(`\n--- Found: ${eduardo.id} | ${eduardo.facilitadores?.nombre} ---`);
    console.log("Attempting DELETE...");
    const del = await fetch(P + `/api/destacados/${eduardo.id}`, { method: "DELETE", headers: auth });
    console.log("Status:", del.status);
    const delData = await del.json();
    console.log("Response:", JSON.stringify(delData));

    // Verify
    const after = await fetch(P + "/api/destacados", { headers: auth });
    const afterData = await after.json();
    console.log("\nAfter delete, remaining:", afterData.length);
    for (const d of afterData) {
      console.log(`  - ${d.facilitadores?.nombre || d.id}`);
    }
  } else {
    console.log("Eduardo Palermo not found in destacados");
  }
}

test().catch(console.error);
