<?php
    require_once __DIR__ . '/DAO.php';
    header('Content-Type: application/json');
    header("Access-Control-Allow-Methods: GET");

    class API extends DAO {
        public function getHighScores() {
            $sql = "SELECT * FROM `hiscores`";
            $statement = $this->pdo->prepare($sql);
            $statement->execute();
            $response["data"] = $statement->fetchAll(PDO::FETCH_ASSOC);
            $response["success"] = true;
            echo(json_encode($response));
        }
    }
    
    $class = new API();
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        switch ($_REQUEST['do']) {
            case '/getHighScores':
                $class->getHighScores();
                break;
            default:
                $response["success"] = false;
                echo(json_encode($response));
                break;
        }
    }
?>
