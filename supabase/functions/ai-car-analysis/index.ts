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
    const token = Deno.env.get("HF_TOKEN");

    if (!token) {
      return new Response(
        JSON.stringify({ error: "HF_TOKEN is not configured" }),
        { status: 500, headers: cors },
      );
    }

    const body = await req.json();

    const image = body.image;
    const prompt =
      body.prompt ||
      "این تصویر خودرو را بررسی کن و آسیب‌های قابل مشاهده را به زبان فارسی توضیح بده.";

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
