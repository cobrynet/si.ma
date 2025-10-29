<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Verifica che sia una richiesta POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metodo non consentito']);
    exit;
}

// Ricevi i dati dal form
$data = json_decode(file_get_contents('php://input'), true);

// Validazione dati
if (empty($data['department']) || empty($data['fullname']) || empty($data['email']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Campi obbligatori mancanti']);
    exit;
}

// Sanitizza i dati
$department = filter_var($data['department'], FILTER_SANITIZE_EMAIL);
$fullname = htmlspecialchars($data['fullname'], ENT_QUOTES, 'UTF-8');
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars($data['phone'], ENT_QUOTES, 'UTF-8');
$organization = htmlspecialchars($data['organization'] ?? '', ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8');

// Valida email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email non valida']);
    exit;
}

// Prepara l'email
$to = $department;
$subject = "Nuova richiesta da $fullname - Sito SI-MA SRL";
$emailBody = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #18202d; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #18202d; }
        .value { margin-top: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Nuova Richiesta dal Sito Web</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Dipartimento:</div>
                <div class='value'>$department</div>
            </div>
            <div class='field'>
                <div class='label'>Nome completo:</div>
                <div class='value'>$fullname</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'><a href='mailto:$email'>$email</a></div>
            </div>
            <div class='field'>
                <div class='label'>Telefono:</div>
                <div class='value'>$phone</div>
            </div>
            " . (!empty($organization) ? "
            <div class='field'>
                <div class='label'>Organizzazione:</div>
                <div class='value'>$organization</div>
            </div>
            " : "") . "
            <div class='field'>
                <div class='label'>Messaggio:</div>
                <div class='value'>" . nl2br($message) . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>Questo messaggio è stato inviato dal form di contatto del sito SI-MA SRL</p>
            <p>www.assistenzalavanderie.it</p>
        </div>
    </div>
</body>
</html>
";

// Headers email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: noreply@assistenzalavanderie.it" . "\r\n";
$headers .= "Reply-To: $email" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Invia l'email
if (mail($to, $subject, $emailBody, $headers)) {
    echo json_encode([
        'success' => true, 
        'message' => 'Email inviata con successo a ' . $department
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Errore nell\'invio dell\'email. Riprova più tardi.'
    ]);
}
?>
