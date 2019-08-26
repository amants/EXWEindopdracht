<?php
    require_once __DIR__ . '/DAO.php';
    header('Content-Type: application/json');
    header("Access-Control-Allow-Methods: GET");

    class API extends DAO {
        public function getHighScores() {
            $sql = "SELECT * FROM `hiscores` ORDER BY score DESC LIMIT 15";
            $statement = $this->pdo->prepare($sql);
            $statement->execute();
            $response["data"] = $statement->fetchAll(PDO::FETCH_ASSOC);
            $response["success"] = true;
            echo(json_encode($response));
        }

        public function setHighscore($payload) {
            if (!empty($payload["username"]) && !empty($payload["score"])) {
                $sql = "INSERT INTO `hiscores` (`username`, `score`) VALUES (:username, :score);";
                $statement = $this->pdo->prepare($sql);
                $statement->bindValue(':username', $payload["username"]);
                $statement->bindValue(':score', $payload["score"]);
                $statement->execute();
                $response["success"] = true;
            } else {
                $response["error"] = "The required fields aren't set";
                $response["success"] = "no";
                $response["urshit"] = $payload;
            }
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
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        switch ($_REQUEST['do']) {
            case '/setHighscore':
                $class->setHighscore(json_decode(file_get_contents('php://input'),true));
                break;
            default:
                $response["success"] = "no";
                $response["what"] = $_REQUEST;
                echo(json_encode($response));
                break;
        }
    }
?>
