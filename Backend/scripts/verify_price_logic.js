const createProductUrl = "http://localhost:8000/api/admin/products";

async function testScenario(name, payload, expectedStatus, checkFn) {
  console.log(`\n--- Running Test: ${name} ---`);
  try {
    const response = await fetch(createProductUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(`Status: ${response.status}`);
    const data = await response.json();

    if (response.status !== expectedStatus) {
      console.error(
        `FAILED: Expected status ${expectedStatus}, got ${response.status}`,
      );
      console.error("Response:", JSON.stringify(data, null, 2));
      return false;
    }

    if (checkFn) {
      const result = checkFn(data);
      if (!result) {
        console.error("FAILED: Check function returned false");
        console.error("Response:", JSON.stringify(data, null, 2));
        return false;
      }
    }

    console.log("PASSED");
    return true;
  } catch (error) {
    console.error("ERROR:", error.message);
    return false;
  }
}

async function runTests() {
  // Scenario 1: No Variants
  await testScenario(
    "1. Missing Variants",
    { title: "Test Product No Variants" },
    500, // Assuming controller returns 500 on error based on code
  );

  // Scenario 2: No Images
  await testScenario(
    "2. Missing Images",
    {
      title: "Test Product No Images",
      variants: [{ color: "Red", price: 100 }],
    },
    500,
  );

  // Scenario 3: Global Price Inheritance
  await testScenario(
    "3. Price Inheritance",
    {
      title: "Test Product Inheritance",
      price: 1000,
      variants: [{ color: "Red", images: ["http://example.com/img.jpg"] }],
    },
    201,
    (data) => {
      const variantPrice = data.variants[0].price;
      console.log(`Global Price: 1000, Variant Price: ${variantPrice}`);
      return variantPrice === 1000;
    },
  );

  // Scenario 4: Specific Price Override
  await testScenario(
    "4. Price Override",
    {
      title: "Test Product Override",
      price: 1000,
      variants: [
        { color: "Blue", images: ["http://example.com/img.jpg"], price: 500 },
      ],
    },
    201,
    (data) => {
      const variantPrice = data.variants[0].price;
      console.log(
        `Global Price: 1000, Request Variant Price: 500, Actual Variant Price: ${variantPrice}`,
      );
      return variantPrice === 500;
    },
  );
  // Scenario 5: Check Details Persistence
  await testScenario(
    "5. Details Persistence",
    {
      title: "Test Product Details",
      price: 1000,
      variants: [{ color: "Green", images: ["http://example.com/img.jpg"] }],
      details: { fabric: "Cotton", fit: "Slim" },
    },
    201,
    (data) => {
      console.log("Details received:", JSON.stringify(data.details));
      return (
        data.details &&
        data.details.fabric === "Cotton" &&
        data.details.fit === "Slim"
      );
    },
  );
}

runTests();