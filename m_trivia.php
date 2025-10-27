<?php

error_reporting(E_ALL); ini_set('display_errors', 1);





 user::api_login_by_id(36);



class m_trivia extends bgl_Model

{



	function general()

    {

        $ret = [];



        $ret["monthly_leaders"] =  DB::get_all("SELECT * FROM `CRM_trivia_games` WHERE date_created > DATE_SUB(NOW(), INTERVAL 1 MONTH) ORDER BY score DESC LIMIT 10");



        foreach($ret["monthly_leaders"]  as &$score)

        {

            $score["name"] = DB::get_val("users",["id" => $score["user_id"]],"display_name");

            $score["date_created"] = date("Y-m-d",strtotime($score["date_created"]));

        }



        $ret["all_time_leaders"] =  DB::get_all("SELECT * FROM `CRM_trivia_games` ORDER BY score DESC LIMIT 10");
        $ret["text"] =  LANGS::get_word("trivia_text");



        unset($score);



        foreach($ret["all_time_leaders"]  as &$score)

        {

            $score["name"] = DB::get_val("users",["id" => $score["user_id"]],"display_name");

            $score["date_created"] = date("Y-m-d",strtotime($score["date_created"]));

        }



        $ret["my_last_games"] =  DB::get_all("SELECT * FROM `CRM_trivia_games` WHERE user_id = ".user::get("me")->id." AND score > 0 ORDER BY score DESC LIMIT 10");





        unset($score);



        foreach($ret["my_last_games"]  as &$score)

        {

            $score["name"] = user::get("me")->display_name;

            $score["date_created"] = date("Y-m-d",strtotime($score["date_created"]));

        }



        return $ret;

    }

   

    function start_game()

    {

        $number_of_questions = 20;



        $difficulty_1_per = 0.7;

        $difficulty_2_per = 0.2;

        $difficulty_3_per = 0.1;



        $difficulty_3_limit = ceil($number_of_questions * $difficulty_1_per);

        $difficulty_2_limit = ceil($number_of_questions * $difficulty_2_per);

        $difficulty_1_limit = $number_of_questions - $difficulty_3_limit - $difficulty_2_limit;





        $random_questions = [];

        for ($i = 1; $i <= 3; $i++) 

        {

            $list = DB::get_all("

            SELECT * 

            FROM CRM_trivia 

            WHERE difficulty = ".$i."

            ORDER BY 

                IF(id IN (

                    SELECT question_id 

                    FROM CRM_trivia_games_log log

                    JOIN CRM_trivia_games games ON log.game_id = games.id

                    WHERE games.user_id = " . user::get("me")->id . " AND log.user_answer > 0

                ), 1, 0) ASC, 

                RAND() 

            LIMIT ".${"difficulty_".$i."_limit"});



            $random_questions = array_merge($random_questions,$list);

        }



        shuffle($random_questions);



        $ins = DB::update("trivia_games");

        $ins->set_var("user_id",user::get("me")->id);

        $ins->insert();



        foreach($random_questions as $question)

        {

            $ins_question = DB::update("trivia_games_log");

            $ins_question->set_var("game_id",$ins->new_id);

            $ins_question->set_var("question_id",$question["id"]);

            $ins_question->insert();

        }



        return ["game_token" => MISC::encode($ins->new_id),"ttl_questions" => count($random_questions)];

    }



    function get_question($m_settings)

    {

        $settings = array(

			"game_token" => "",

		);

		

		self::merge($settings, $m_settings);



        $game = DB::get_row("SELECT * FROM `CRM_trivia_games` WHERE id = ".MISC::decode($settings["game_token"]));



        $next_question = DB::get_row("SELECT * FROM `CRM_trivia_games_log` WHERE game_id = ".$game["id"]." AND date_start is NULL AND user_answer = 0 ORDER BY id ASC LIMIT 1");



        if(!$next_question)

        {

            //check if game score is in the top 10

            $scores_before_me_month = DB::get_row("SELECT COUNT(*) AS ttl FROM `CRM_trivia_games` WHERE  date_created > DATE_SUB(NOW(), INTERVAL 1 MONTH) AND score > ".$game["score"],"ttl");

            $scores_before_all_time = DB::get_row("SELECT COUNT(*) AS ttl FROM `CRM_trivia_games` WHERE   score > ".$game["score"],"ttl");

            if($scores_before_all_time <= 10)

            {

                $note = "ברכותינו!! נכנסת לרשימת המובילים של כל הזמנים!!!!";

            }

            else if($scores_before_me_month <= 10 && $scores_before_all_time > 10)

            {

               $note = "ברכותינו!! נכנסת לרשימת המובילים החודשית!!";

            }

            else{

                $note = "אויש הפעם לא הצלחתם :( נסו שוב!";

            }

            



            return ["status" => 'game_over' ,"note" => $note,"score" => $game["score"],"month_position" => $scores_before_me_month+1,"all_time_position" => $scores_before_all_time+1];

        }

        $question = DB::get_row("SELECT question,answer_1,answer_2,answer_3,answer_4 FROM `CRM_trivia` WHERE id = ".$next_question["question_id"]);



        $now = date("Y-m-d H:i:s",time() + 1);



        $up = DB::update("trivia_games_log");

        $up->set_var("date_start",$now);

        $up->update($next_question["id"]);



        $question["answers"] = [

            ["index" => 1,"content" => $question["answer_1"]],

            ["index" => 2,"content" => $question["answer_2"]],

            ["index" => 3,"content" => $question["answer_3"]],

            ["index" => 4,"content" => $question["answer_4"]]

        ];

        shuffle($question["answers"]);



        $question["token"] = MISC::encode($next_question["id"]);

        unset($question["answer_1"]);

        unset($question["answer_2"]);

        unset($question["answer_3"]);

        unset($question["answer_4"]);



        return $question;

    }



    function use_fifty_fifty($m_settings)

    {

        $settings = array(

			"token" => "",

			"game_token" => "",

		);

		

		self::merge($settings, $m_settings);



        $game_id = MISC::decode($settings["game_token"]);

        

        $question_log = DB::get_row("SELECT * FROM CRM_trivia_games_log WHERE game_id = ".$game_id." AND id = ".MISC::decode($settings["token"]));



        if(!$question_log)

        {

            return false;

        }



        // Get the question to know the correct answer

        $question = DB::get_row("SELECT * FROM CRM_trivia WHERE id = ".$question_log["question_id"]);



        // Get all answer indices except the correct one

        $all_indices = [1, 2, 3, 4];

        $wrong_indices = array_values(array_filter($all_indices, function($index) use ($question) {

            return $index != $question["answer"];

        }));



        // Shuffle and pick 2 wrong answers to remove

        shuffle($wrong_indices);

        $indices_to_remove = array_slice($wrong_indices, 0, 2);



        return ["remove_indices" => $indices_to_remove];

    }



    function answer($m_settings)

    {

        $settings = array(

			"token" => "",

			"game_token" => "",

			"answer" => "",

		);

		

		self::merge($settings, $m_settings);



        $game_id = MISC::decode($settings["game_token"]);

        

        $question_log = DB::get_val("trivia_games_log",["game_id" => $game_id,"id" => MISC::decode($settings["token"])]);



        if(!$question_log || (int)$question_log["user_answer"] > 0)

        {

            return false;

        }



        $up = DB::update("trivia_games_log");

        $up->set_var("user_answer",$settings["answer"]);

        $up->set_var("date_end",date("Y-m-d H:i:s"));

        $up->update($question_log["id"]);



        //parse score

        $question = DB::get_val("trivia",["id" => $question_log["question_id"]]);



        //get the diffrance in secondes between the start and end

        $start = strtotime($question_log["date_start"]);

        $end = time();

        $ttl_seconds = $end - $start;



        $score = 0;

        if($question["answer"] == $settings["answer"])

        {

            $score += 50;

            // max points for short answer 50, min points 0. max time to bonus 15 seconds. if user answered in 0 seconds he gets 50 points, if he answered in 15 or more seconds he gets 0 points.

            $bonus = 50;

            $bonus_max_time = 15;



            $arr = ["ceil","floor"];

            $randRound = array_rand($arr);



            $randRound = $arr[$randRound];



            $bonus_per_second = call_user_func($randRound, ($bonus / $bonus_max_time));

            $bonus_score = $bonus - ($ttl_seconds * $bonus_per_second);

            if($bonus_score > 50) $bonus_score = 50;
			

           	$ttl_bonus = ($bonus_score > 0) ? $bonus_score : 0;

            $score += $ttl_bonus;



        }

        else

        {
			$ttl_bonus = 0;
            $score = 0;

        }





        $up = DB::sql(" UPDATE CRM_trivia_games SET score = score +" .$score." WHERE id = ".$game_id);



        $game = DB::get_row("SELECT * FROM `CRM_trivia_games` WHERE id = ".$game_id);



        return ["score" => $game["score"],"correct" => $question["answer"],"earnedPoints" => $score-$ttl_bonus,"ttl_bonus" => $ttl_bonus];



    }



	function get_game()

	{

		

		

			

		

		return $arrRes;

	}

    

	function parse_item(&$item)

	{

        

	}

    

   

}