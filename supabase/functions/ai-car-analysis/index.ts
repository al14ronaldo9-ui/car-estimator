Deno.serve(async () => {
  const token = Deno.env.get("HF_TOKEN");

  const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "Qwen/Qwen2.5-VL-7B-Instruct",
      messages: [
        {
          role: "user",
          content: "Reply with exactly: MODEL_OK"
        }
      ],
      max_tokens: 20
    })
  });

  const text = await response.text();

  return new Response(text, {
    status: response.status,
    headers: {
      "Content-Type": "application/json"
    }
  });
});
