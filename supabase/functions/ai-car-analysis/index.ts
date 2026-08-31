Deno.serve(async (req) => {
  const cors = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Only POST is allowed" }),
      { status: 405, headers: cors },
    );
  }

  try {
    const body = await req.json();
    const image = body.image;
    const mode = body.mode || "chat";

    /*
     * ================================
     * ROBOFLOW DAMAGE DETECTION
     * ================================
     */

    if (mode === "roboflow_damage" || mode === "specialized" || mode === "car_gate") {
      const rfKey = Deno.env.get("ROBOFLOW_API_KEY");

      const modelId =
        Deno.env.get("ROBOFLOW_DAMAGE_MODEL") ||
        "car-damage-v5-wdqin/1";

      if (!rfKey) {
        return new Response(
          JSON.stringify({
            error: "ROBOFLOW_API_KEY is not configured",
          }),
          { status: 503, headers: cors },
        );
      }

      if (!image) {
        return new Response(
          JSON.stringify({
            error: "image is required",
          }),
          { status: 400, headers: cors },
        );
      }

      const base64 = image.includes(",")
        ? image.split(",")[1]
        : image;

      const rfResponse = await fetch(
        `https://serverless.roboflow.com/${modelId}?api_key=${encodeURIComponent(
          rfKey,
        )}&confidence=10&overlap=30&image_type=base64&format=json`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: base64,
        },
      );

      const rfText = await rfResponse.text();
      if (mode === "car_gate") {
        let rfData;
        try { rfData = JSON.parse(rfText); } catch (_) { rfData = {}; }
        const predictions = Array.isArray(rfData.predictions) ? rfData.predictions : [];
        const confidence = predictions.length ? Math.max(...predictions.map(p => Number(p.confidence) || 0)) : 0;
        const is_car = predictions.length > 0;
        return new Response(JSON.stringify({ is_car, confidence }), { status: rfResponse.status, headers: cors });
      }

      return new Response(rfText, {
        status: rfResponse.status,
        headers: cors,
      });
    }

    /*
     * ================================
     * HUGGING FACE
     * ================================
     */

    const token = Deno.env.get("HF_TOKEN");

    if (!token) {
      return new Response(
        JSON.stringify({
          error: "HF_TOKEN is not configured",
        }),
        { status: 500, headers: cors },
      );
    }

    let prompt =
      body.prompt ||
      "این تصویر خودرو را بررسی کن و آسیب‌های قابل مشاهده را به زبان فارسی توضیح بده.";

    if (mode === "car_gate") {
      prompt = `تو مرحله اعتبارسنجی ورودی یک سامانه کارشناسی خودرو هستی.

فقط مشخص کن آیا تصویر واقعاً شامل یک خودروی قابل مشاهده است یا نه.

اگر تصویر انسان، حیوان، منظره، لیوان، قطعه جدا از خودرو یا چیز نامرتبط است:
is_car=false

اگر حتی بخشی از خودروی واقعی قابل مشاهده است:
is_car=true

هیچ خسارتی را در این مرحله تحلیل نکن.

فقط JSON معتبر برگردان:

{"is_car":true,"confidence":0.98,"reason":"..."}`;
    }

    let messages;

    if (image) {
      messages = [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ];
    } else if (Array.isArray(body.messages)) {
      messages = body.messages;
    } else {
      messages = [
        {
          role: "user",
          content: prompt,
        },
      ];
    }

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "zai-org/GLM-4.5V",
          messages,
          max_tokens: 2000,
          temperature: 0.3,
        }),
      },
    );

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: cors,
    });
  } catch (error) {
    console.error("AI ERROR:", error);

    return new Response(
      JSON.stringify({
        error: "AI request failed",
        details: String(error),
      }),
      { status: 500, headers: cors },
    );
  }
});
