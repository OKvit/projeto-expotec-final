// Chave de API do OpenAI (deve ser armazenada de maneira segura, não diretamente no código)
const apiKey = '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'; // Truncado para manter segurança

function sendMessage() {
    var message = document.getElementById('message-input');
    if (!message.value) {
        message.style.border = '1px solid red';
        return;
    }
    message.style.border = 'none';

    var status = document.getElementById('status');
    var btnSubmit = document.getElementById('btn-submit');

    status.style.display = 'block';
    status.innerHTML = 'Carregando...';
    btnSubmit.disabled = true;
    btnSubmit.style.cursor = 'not-allowed';
    message.disabled = true;

    // Configuração da requisição para a API de Chat da OpenAI
    fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // Alterar para o modelo de chat
            messages: [{ role: "user", content: message.value }],
            max_tokens: 2048, // tamanho da resposta
            temperature: 0.5 // criatividade na resposta
        })
    })
    .then((response) => response.json())
    .then((response) => {
        // Ajuste para obter a resposta do chat
        let r = response.choices[0]['message']['content'];
        status.style.display = 'none';
        showHistory(message.value, r);
    })
    .catch((e) => {
        console.log(`Error -> ${e}`);
        status.innerHTML = 'Erro, tente novamente mais tarde...';
    })
    .finally(() => {
        btnSubmit.disabled = false;
        btnSubmit.style.cursor = 'pointer';
        message.disabled = false;
        message.value = '';
    });
}

function showHistory(message, response) {
    var historyBox = document.getElementById('history');

    // Criar um elemento para a mensagem do usuário
    var boxMyMessage = document.createElement('div');
    boxMyMessage.className = 'box-my-message';

    var myMessage = document.createElement('p');
    myMessage.className = 'my-message';
    myMessage.textContent = message; // Usar textContent para evitar XSS

    boxMyMessage.appendChild(myMessage);
    historyBox.appendChild(boxMyMessage);

    // Criar um elemento para a resposta da API
    var boxResponseMessage = document.createElement('div');
    boxResponseMessage.className = 'box-response-message';

    var chatResponse = document.createElement('p');
    chatResponse.className = 'response-message';
    chatResponse.textContent = response; // Usar textContent para evitar XSS

    boxResponseMessage.appendChild(chatResponse);
    historyBox.appendChild(boxResponseMessage);

    // Levar o scroll para o final
    historyBox.scrollTop = historyBox.scrollHeight;
}
