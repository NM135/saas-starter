const express = require("express");
const app = express();

const stripe = require("stripe")(
  // This is your test secret API key.
  'sk_test_51QnzKrIRCrzRa9yRznqJhQja0bw8jjxSDkCW1uC9rrVdyNHWzROnDwx3kAAI9hwyxfet9mljEaYbRds9Ilh6qM2k00g2qMDkFT', {
    apiVersion: "2023-10-16",
  }
);

app.use(express.static("dist"));
app.use(express.json());

app.post("/account/:account", async (req, res) => {
  try {
    const connectedAccountId = req.params.account;

    const account = await stripe.accounts.update(
      connectedAccountId,
      {
        business_type: 'individual',
      },
    );


    res.json({
      account: account.id,
    });
  } catch (error) {
    console.error(
      "An error occurred when calling the Stripe API to update an account",
      error
    );
    res.status(500);
    res.send({ error: error.message });
  }
});

app.post("/account", async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      controller: {
        stripe_dashboard: {
          type: "none",
        },
        fees: {
          payer: "application"
        },
        losses: {
          payments: "application"
        },
        requirement_collection: "application",
      },
      capabilities: {
        card_payments: {requested: true},
        transfers: {requested: true}
      },
      country: "US",
    });

    res.json({
      account: account.id,
    });
  } catch (error) {
    console.error(
      "An error occurred when calling the Stripe API to create an account",
      error
    );
    res.status(500);
    res.send({ error: error.message });
  }
});

app.get("/*", (_req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(4242, () => console.log("Node server listening on port 4242! Visit http://localhost:4242 in your browser."));