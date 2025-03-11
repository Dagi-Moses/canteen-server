const { onDocumentCreated } = require("firebase-functions/v2/firestore"); // New Firestore trigger method
const admin = require("firebase-admin");


exports.notifyDrivers = onDocumentCreated(
  "/canteen/orders/{orderId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with the event.");
      return;
    }

    const orderData = snapshot.data();

    const message = {
      notification: {
        title: "New Order",
        body: `Order #${orderData.menuId} is ready for dispatch.`,
      },
      topic: "canteen_orders",
    };

    try {
      await admin.messaging().send(message);
      console.log("Notification sent successfully.");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
);
