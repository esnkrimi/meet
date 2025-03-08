<?php
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");


function fetchAllMessages($con){
    $receiver=$_GET['receiver'];
    $sender=$_GET['sender'];
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT * from messages where (sender='$sender' and email='$receiver' ) or (sender='$receiver' and email='$sender' ) order by id desc" ;//echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
                  array_push($resultArray, $row);
        }
    }
    $t=json_encode($resultArray);
    if(strlen($t)!=2)   echo $t;  
}


function fetchMessages($con){
    $userEmail=$_GET['email'];
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT distinct sender,email,date from messages where sender='$userEmail' or email='$userEmail'" ;//echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
           if(!repeatedMessage($resultArray,$row->sender,$row->email))
            {
              $row->content=getLastMessage($con,$row->sender,$row->email)->message;
              if(strcmp($userEmail,$row->email)==0)
                $row->icon=$row->sender;
              else
                $row->icon=$row->email;
              array_push($resultArray, $row);
            }
        }
    }
    $t=json_encode($resultArray);
    if(strlen($t)!=2)   echo $t;  
}
function getLastMessage($con,$sender,$receiver){
    $sql = "SELECT message from  messages where (sender='$sender' and email='$receiver' ) or (email='$sender' and email='sender' ) order by id desc" ;//echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        $row = $result->fetch_object();
    }    
    return $row;
}

function repeatedMessage($source,$sender,$receiver){
        for($i=0;$i<count($source);$i++){
            if((($source[$i]->email==$sender)and($source[$i]->sender==$receiver))||(($source[$i]->sender==$sender)and($source[$i]->email==$receiver)))
                return true;
        }
        return false;
}

function sendMessage($con){
    $email=$_GET['email'];
    $sender=$_GET['sender'];
    $message=$_GET['message'];
    $id=$con->GET_MAX_COL('messages','id');
    $date=date("YmdHis");
    $sql = "insert into messages values($id,'$sender','$email','$message','$date')";  //echo $sql;
    $con->QUERY_RUN($con,$sql);
    echo('[{"success":'.'"YES"'."}]");
}


function updateUserCommentlike($con){
    $cid=$_GET['cid'];
    $action=$_GET['action'];
    if(strcmp($action,'add')==0) $cond="likecount+1";else  $cond="likecount-1";
    $resultArray = array();
    $tempArray = array();
    $sql = "update comment set likecount=".$cond." where id=$cid";  //echo $sql;
    echo('[{"success":'.'"YES"'."}]");
}


function fetch_experiences_by_parameters($con,$offset,$groupId,$seed,$typeOfPost,$userEmail,$sort){
     if(strcmp($seed,'public')!=0){
        if(strcmp($userEmail,'undefined')!=0)
            $result=fetch_experiences_by_interresting_cats($con,$offset,$groupId,$typeOfPost,$userEmail);//var_dump($arrayInterrestedPosts);
    }
    else{
            $result=fetch_experiences_by_public($con,$offset,$groupId,$typeOfPost,$userEmail);//var_dump($arrayInterrestedPosts);    
    }
    
    if(strcmp($sort,'new')==0){
      usort($result, "cmp");
    }else if(strcmp($sort,'like')==0)
      usort($result, "likeCmp");
           
    $t=json_encode($result);
    if(strlen($t)!=2)   echo $t;
}



function deletePost($con){
    $userEmail=$_GET['email'];
    $eid=$_GET["eid"];
    $sql = "SELECT * FROM user,exp where user.email='$userEmail'and user.id=exp.userid and exp.id=$eid";
    if ($result=$con->QUERY_RUN($con,$sql)	){
        $row = $result->fetch_object();
        if($row->id)  {
           $sql = "delete from  comment where expid=$eid ";
           $result=$con->QUERY_RUN($con,$sql);  

          $sql = "delete from  likes where expid=$eid ";
           $result=$con->QUERY_RUN($con,$sql);  
           
          $sql = "delete from  exp_category where expid=$eid ";
           $result=$con->QUERY_RUN($con,$sql);
           
          $sql = "delete from  exp where id=$eid ";
           $result=$con->QUERY_RUN($con,$sql); 
        }
    }

    fetch_experiences_by_parameters($con,0,'all','public','all',$userEmail,'new');
}

function deleteComment($con){
    $eid=$_GET['eid']; 
    $sql = "delete from  comment where id=$eid ";
    $result=$con->QUERY_RUN($con,$sql);  
}

function fetchSavedPosts($con){
    $userEmail=$_GET['email'];
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT saves.expid as id,exp.title,exp.content,exp.date,exp.typeofpost FROM `saves` ,exp where exp.id=saves.expid and saves.useremail='$userEmail'"; //echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
                $tempArray = $row;
                array_push($resultArray, $row);
        }
    }
    $t=json_encode($resultArray);
    if(strlen($t)!=2)   echo $t;  
}

function savePost($con){
    $userEmail=$_GET['userEmail'];
    $postId=$_GET["postId"];
    $sql = "SELECT * FROM saves where useremail='$userEmail' and expid=$postId"; //echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        $row = $result->fetch_object();
        if($row->expid)  $sqlFinal = "delete FROM saves where useremail='$userEmail' and expid=$postId";
        else{
            $sqlFinal = "insert into saves values('$userEmail',$postId)";
        }
      $result=$con->QUERY_RUN($con,$sqlFinal);
    }
 
 
    echo('[{"success":'.'"YES"'."}]");
}



function sendSms($con,$phone,$ref){

    $client = new SoapClient("http://188.0.240.110/class/sms/wsdlservice/server.php?wsdl");
    $user = "09188108019";
    $pass = "AnDyMaMa!1";
    $fromNum = "+9890000145";
    $toNum = array($phone);
    $pattern_code = "181p4w4p35";
    $input_data = array(
     "verification-code" => $ref,

    );
    echo $client ->sendPatternSms($fromNum, $toNum, $user, $pass, $pattern_code, $input_data);
}

function sendCodeMobile($con){
    $mobile=$_GET['mobile']; 
    $row->result='finish';
    $t=json_encode($row);
    $sql = "delete from  codelogin where mobile='$mobile' ";
    $result=$con->QUERY_RUN($con,$sql);
    $code=rand(12345,99999);
    $sql = "insert into codelogin values('$mobile','$code') ";
    $result=$con->QUERY_RUN($con,$sql);
    sendSms($con,$mobile,$code);
    if(strlen($t)!=2)   echo $t;
}

function loginViaMobile($con){
    $mobile=$_GET['mobile']; 
    $code=$_GET['code']; 
    $sql = "SELECT * from codelogin where mobile='$mobile' and code='$code'"; //echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
              REGISTERPARAMETER($con,$mobile);
        }
    }
    else{
        echo('[{"success":'.'"no"'."}]");
    }

}
function REGISTERPARAMETER($con,$mobile){
    $sql = "SELECT * FROM user where phone='$mobile'";
    if ($result=$con->QUERY_RUN($con,$sql)	){
      if( $row = $result->fetch_object()){
        $row->firstName=$row->name;
        $row->lastName=$row->family;
      }
      else{
        $id=$con->GET_MAX_COL('user','id');
        $sql = "insert into user values($id,1,'','','$mobile','$mobile','','','')";//echo $sql;
        $result=$con->QUERY_RUN($con,$sql);
        
        $sql = "SELECT * FROM user where phone='$mobile'";
        if ($result=$con->QUERY_RUN($con,$sql)	){
             if( $row = $result->fetch_object()){
                $row->firstName=$row->name;
                 $row->lastName=$row->family;
              }
        }
    }   
    $t=json_encode($row);
    if(strlen($t)!=2)   echo $t;
 }
}

function FetchUserProfileByArgument($con,$id){
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT email FROM user where email='$id'"; // echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
                $tempArray = $row;
                array_push($resultArray, $row);
        }
    }
    $t=json_encode($resultArray);
    if(strlen($t)!=2)   echo $t;
}

function FetchUserProfileByArgumentFull($con,$email){
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT id,name,family,email,birthdate,cityid FROM user where email='$email'";
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
                $tempArray = $row;
                $row->interrests=fetchUserInterrests($con,$row->id);
                array_push($resultArray, $row);
        }
    }
    $t=json_encode($resultArray);
    if(strlen($t)!=2)   echo $t;
}

function fetchUserInterrests($con,$uid){
    $resultArray = array();
    $sql = "SELECT catid,name FROM user_category  inner  join category on category.id=user_category.catid  where userid=$uid"; //echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
      while($row = $result->fetch_object()){
        array_push($resultArray, $row);
      }
    }
    return $resultArray;
}

function doUserLikeCategory($con,$userid,$catid){
    $sql = "SELECT * from user_category where userid=$userid and catid=$catid";
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
            return true;
        }
    }
    return false;
}

function toggleLikeCategoriese($con){
    $userEmail=$_GET['email'];    
    $action=$_GET['action'];    
    $catid=$_GET['catid'];    
    $userid=fetchUserByUserEmail($con,$userEmail)->id;
    $id=$con->GET_MAX_COL('user_category','id');
   // $catId=findCatIdByName($con,$cat[$i]);
    if(strcmp($action,'remove')==0)
        $sql = "delete from user_category where userid=$userid and catid=$catid";
    else{
        if(!doUserLikeCategory($con,$userid,$catid))
           $sql = "insert into user_category values($id,$userid,$catid)"; 
    }
    $con->QUERY_RUN($con,$sql);
    FetchUserProfileByArgumentFull($con,$userEmail);    
}

function getFollowerOfThisUser($con,$userid){
    $resultArray = array();
        $sql = "SELECT followerid,date from follows where userid=$userid";  
        if ($result=$con->QUERY_RUN($con,$sql)	){
            while($row = $result->fetch_object()){
               $row->email=fetchUserByUserid($con,$row->followerid)->email;
                if(strcmp(fetchUserByUserid($con,$row->followerid)->email,'guest')!=0) array_push($resultArray, $row);
            }
        }
        return $resultArray;
}

function getFollowingOfThisUser($con,$userid){
    $resultArray = array();
        $sql = "SELECT userid,date from follows where followerid=$userid";  
        if ($result=$con->QUERY_RUN($con,$sql)	){
            while($row = $result->fetch_object()){
              $row->email=fetchUserByUserid($con,$row->userid)->email;
                 if(strcmp(fetchUserByUserid($con,$row->userid)->email,'guest')!=0)   array_push($resultArray, $row);
            }
        }
        return $resultArray;
}

function followerOfUsers($con){
    $userEmail=$_GET['user'];    
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT distinct id from user where email='$userEmail'";  
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
            $row->follower=getFollowerOfThisUser($con,$row->id);
            $row->following=getFollowingOfThisUser($con,$row->id);
            $tempArray = $row;
            array_push($resultArray, $row);
        }
    }
    
    $t=json_encode($resultArray);
    if(strlen($t)!=2)   echo $t;   
}





function doUserFollowThisUser($con,$userid,$followerid){
    $sql = "SELECT * from follows where followerid=$followerid and userid=$userid";//echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
            return true;
        }
    }
    return false;
}

 function toggleFollowing($con){
    $followerid=$_GET['followerid'];    
    $userid=$_GET['userid']; 
    $action=$_GET['action'];    
    
    $id=$con->GET_MAX_COL('follows','id');
    $date=date("YmdHis");
    
    if(strcmp($action,'remove')==0)
        $sql = "delete from follows where userid=$userid and followerid=$followerid";
    else{
        if(!doUserFollowThisUser($con,$userid,$followerid))
           $sql = "insert into follows values($id,$followerid,$userid,'$date')"; 
    }
    $con->QUERY_RUN($con,$sql);
    followerOfUsersSimple($con);

 }  
 
 function followerOfUsersSimple($con){
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT distinct id from user";  
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
            $row->follower=getFollowerOfThisUser($con,$row->id);
            $tempArray = $row;
            array_push($resultArray, $row);
        }
    }
    
    $t=json_encode($resultArray);
    if(strlen($t)!=2)   echo $t;   
}

function fetchCategoriese($con,$id){
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT * from category"; // echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
                $tempArray = $row;
                array_push($resultArray, $row);
        }
    }
    
    $t=json_encode($resultArray);
    if(strlen($t)!=2)   echo $t;
}
function updateProfilePicture($con){
    $email=$_GET['email'];
    $userid=$email;

    $file_names = $_FILES["file"]["name"];
    $file=$file_names; 
    for ($i = 0; $i < 1; $i++) {
        $file_name=$file_names[$i];
        $extension = end(explode(".", $file_name));
        $original_file_name = pathinfo($file_name, PATHINFO_FILENAME);
        $file_url = $original_file_name . "-" . date("YmdHis") . "." . $extension;
        $pathDir ="./users/".$userid;
        if ( ! is_dir($pathDir)) {
            mkdir($pathDir);
        }

        $folderPath=$pathDir."/user.jpg";//echo $folderPath;
        move_uploaded_file($_FILES["file"]["tmp_name"][$i], $folderPath);
    }
        echo('[{"commited":"success"}]');

 }

function updateUserProfile($con){
    $email=$_GET['email'];
    $firstName=$_GET['firstName'];
    $lastName=$_GET['lastName'];
    $job=$_GET['job'];
    $resultArray = array();
    $tempArray = array();
    $sql = "update user set name='$firstName', family='$lastName',job='$job' where email='$email'";  //echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        FetchUserProfileByArgument($con,$email);
    }
}

function fetchPostOfAUser($con){
    $id=$_GET['uid'];
    $id=fetchUserByUserEmail($con,$id)->id;
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT * FROM exp where userid=$id order by id desc";  //echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
                $tempArray = $row;
                $row->user=fetchUserByUserid($con,$row->userid);
                $row->comments=fetchCommentByPostid($con,$row->id);
                $row->likes=fetchLikesByPostid($con,$row->id);
                $row->saves=fetchSavesByPostid($con,$row->id);
                array_push($resultArray, $row);
        }
    }
    $t=json_encode($resultArray);
    if(strlen($t)!=2)   echo $t;

}

function FetchUserProfile($con){
    $id=$_GET['uid'];
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT id,name,family,email,birthdate,cityid,job FROM user where email='$id'"; // echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
                $tempArray = $row;
                $row->interrests=fetchUserInterrests($con,$row->id);
                array_push($resultArray, $row);
        }
    }
    
    $t=json_encode($resultArray);
    if(strlen($t)!=2)   echo $t;
}

function fetch_one_experiences($con){
    $postid=$_GET['postid'];

    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT * FROM exp where id=$postid"; // echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
                $tempArray = $row;
                $row->user=fetchUserByUserid($con,$row->userid);
                $row->comments=fetchCommentByPostid($con,$row->id);
                $row->likes=fetchLikesByPostid($con,$row->id);
                $row->saves=fetchSavesByPostid($con,$row->id);
                array_push($resultArray, $row);
        }
    }
    $t=json_encode($resultArray);
    if(strlen($t)!=2)   echo $t;
}

function findCatIdByName($con,$name){
$sql = "SELECT * FROM category where name='$name'";//echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
            return $row->id; 
        }
     $catid=$con->GET_MAX_COL('category','id');
     $sql2 = "insert into category values($catid,'$name',1)";
     $result2=$con->QUERY_RUN($con,$sql2);
     
     $sql3 = "SELECT * FROM category where name='$name'";//  echo $sql;
     if ($result=$con->QUERY_RUN($con,$sql3)	){
        while($row3 = $result->fetch_object()){
            return $row3->id; 
        }
    }
    
}
}

function submitPost($con){
    $email=$_GET['userid'];
    $userid=fetchUserByUserEmail($con,$_GET['userid'])->id;
    $groupid=$_GET['groupid'];

    $title=$_GET['title'];
    $content=$_GET['content'];
    $typeofpost=$_GET['typeofpost'];    
    $date=date("YmdHis");
    $expid=$con->GET_MAX_COL('exp','id');
    $sql = "insert into exp values($expid,$userid,$groupid,'$title','$content','$date',1,'$typeofpost')"; //echo $sql;
    $con->QUERY_RUN($con,$sql);
    $cat=explode(",",$_GET['category']);//var_dump( $cat);
    for($i=0;$i<count($cat);$i++){
        $id=$con->GET_MAX_COL('exp_category','id');
        $catId=findCatIdByName($con,$cat[$i]); 
        if($catId!=''){
          $sql = "insert into exp_category values($id,$expid,$catId)"; echo $sql;
          $con->QUERY_RUN($con,$sql);
        }
    }
    $file = $_FILES["file"];
    $id=$con->GET_MAX_COL('exp','id')-1;
    imgUpload($con,$email,$id,$file);
}

function imgUpload($con,$userid,$id,$file){
    $folderPath = "../";
    $file_names = $_FILES["file"]["name"];
    $file=$file_names; 
    for ($i = 0; $i < 1; $i++) {
        $file_name=$file_names[$i];
        $extension = end(explode(".", $file_name));
        $original_file_name = pathinfo($file_name, PATHINFO_FILENAME);
        $file_url = $original_file_name . "-" . date("YmdHis") . "." . $extension;
        $pathDir ="./users/".$userid;
        if ( ! is_dir($pathDir)) {
            mkdir($pathDir);
        }
        if(strcmp($id,'0')!=0){
            $pathDir ="./users/".$userid."/".$id;
            if ( ! is_dir($pathDir)) {
              mkdir($pathDir);
            }
        }

        $folderPath=$pathDir."/".(1+$i).".jpg";//echo $folderPath;
        move_uploaded_file($_FILES["file"]["tmp_name"][$i], $folderPath);
    }
        echo('[{"commited":"success"}]');

 }

function submitComment($con){
    $userLoginedId=$_GET['userLoginedId'];
    $postId=$_GET['postId'];
    $comment=$_GET['comment'];
    $userID=fetchUserByUserEmail($con,$userLoginedId)->id;//echo $userID;
    $resultArray = array();
    $tempArray = array();
    $cid=$con->GET_MAX_COL('comment','id');
    
    $sql = "insert into comment values($cid,$userID,'$comment',0,$postId,0)"; //echo $sql;
    $con->QUERY_RUN($con,$sql);
    
    $sql = "SELECT * FROM comment where expid=$postId";
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
            $tempArray = $row;
                $objectResult=null;
                $objectResult->user=fetchUserByUserid($con,$row->userid);
                $objectResult->userEmailDestination='';
                $objectResult->id=$row->id;
                $objectResult->expid=$row->expid;
                $objectResult->comment=$row->comment;
                $user=null;
                
            array_push($resultArray, $objectResult);
        }
    }
    $t=json_encode($resultArray);
    if(strlen($t)!=2)   echo $t;
}

function replaceColorize($source,$word){
        $result = str_replace(strtolower($word), "<span class='text-danger fw-bold' style='color:red !important'>".$word."</span>",strtolower($source));
        return $result;
}
function searchPostByWord($con){
    $word=$_GET['word'];
    $word1=str_replace(' ', '', $word);
    $word1=strtolower($word1);
    if(strcmp($word,'RESET123')===0)    echo('[{"success":'.'"reset"'."}]");
    else{
        
    if(count($word)>0) $sqlcondition=" and (trim(lower(title)) like '%$word1%' or trim(lower(content)) like '%$word1%' or trim(lower(name)) like '%$word1%')"; 
    $resultArray = array();
    $tempArray = array();
    $sql = "select * from category,exp,exp_category where exp.id=exp_category.expid and category.id=exp_category.catid $sqlcondition";//echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
            $tempArray = $row;
            $row->user=fetchUserByUserid($con,$row->userid);
            $row->comments=fetchCommentByPostid($con,$row->id);
            $row->likes=fetchLikesByPostid($con,$row->id);
            $row->saves=fetchSavesByPostid($con,$row->id);
            $row->title=replaceColorize($row->title,$word);
            $row->content=replaceColorize($row->content,$word);
            $row->category=fetch_experiences_categories($con,$row->id);
            array_push($resultArray, $row);
        }
    }
    $t=json_encode($resultArray);
    if(strlen($t)!=2)   echo $t;  
    else
        echo('[{"success":'.'"not found"'."}]");
    }

}    

function fetchMenuCat($con){
    $offset=$_GET['offset'];
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT * FROM groups order by title ";
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
            $tempArray = $row;
            $row->count=CountCategory($con,$row->id);
            array_push($resultArray, $row);
        }
    }
    $t=json_encode($resultArray);
    if(strlen($t)!=2)   echo $t;
}

function CountCategory($con,$id){
    $sql = "SELECT count(*) as count FROM exp  where groupid=$id group by groupid";
    if ($result=$con->QUERY_RUN($con,$sql)	){
        $row = $result->fetch_object();
        return $row->count;
    }
}

function likePost($con){
    $userEmail=$_GET['userEmail'];
    $postId=$_GET["postId"];
    $sql = "SELECT * FROM likes where useremail='$userEmail' and expid=$postId"; //echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        $row = $result->fetch_object();
        if($row->expid)  $sqlFinal = "delete FROM likes where useremail='$userEmail' and expid=$postId";
        else{
            $sqlFinal = "insert into likes values('$userEmail',$postId)";
        }
      $result=$con->QUERY_RUN($con,$sqlFinal);
    }
 
 
    echo('[{"success":'.'"YES"'."}]");
}


function REGISTER($con){
    $jsonUser=$_GET['jsonUser'];
    $obj = json_decode($jsonUser, true);
    $firstName=$obj["firstName"];
    $lastName=$obj["lastName"];
    $email=$obj["email"];
    $sql = "SELECT * FROM user where email='$email'";
    if ($result=$con->QUERY_RUN($con,$sql)	){
        $row = $result->fetch_object();
    }
    if(!$row){
        $id=$con->GET_MAX_COL('user','uid');
        $sql = "insert into user(id,name,family,email) 
        values($id,'$firstName','$lastName','$email')";
        $result=$con->QUERY_RUN($con,$sql);
        echo('[{"user_id":'.$id."}]");
    }  
    else
    echo('[{"user_id":'.$row->id."}]");
}
function fetch_experiences_categories($con,$postId){
        $resultArray = array();
        $sql = "SELECT * FROM exp_category where expid=$postId"; //echo $sql;
        if ($result=$con->QUERY_RUN($con,$sql)	){
          while($row = $result->fetch_object()){
            $id=$row->catid;    
            $sql2 = "SELECT * FROM category where id=$id"; //echo $sql2;
             if ($result2=$con->QUERY_RUN($con,$sql2)	){
                 $row2 = $result2->fetch_object();
                 array_push($resultArray, $row2->name);
             }
          }
        }
        return $resultArray;
}


function fetch_experiences_by_interresting_cats($con,$offset,$groupId,$typeOfPost,$userEmail){
    $resultArray = array();
    $tempArray = array();
    if(strcmp($groupId,"all")==0)  $addSql=" "; else $addSql=" groupid=$groupId ";
    if(strcmp($typeOfPost,"all")==0)  $addSqlTypeExp=" "; else $addSqlTypeExp=" typeofpost='$typeOfPost' ";
    if((strcmp($typeOfPost,"all")!=0)||(strcmp($groupId,"all")!=0))  $and1=" and ";
    if((strcmp($typeOfPost,"all")!=0)&&(strcmp($groupId,"all")!=0))  $and2=" and ";
    
    $lastCondition=$addSql.$and2.$addSqlTypeExp;
    $sql="select * from( SELECT userid,catid,email FROM user_category join user on user_category.userid=user.id)as t1 JOIN ( SELECT userid as userid2, groupid, title, content, confirm, typeofpost,date, expid,expid as id, catid FROM exp join exp_category on exp_category.expid=exp.id) as t2 on t1.userid=t2.userid2 and t1.catid=t2.catid
 where email='$userEmail' $and1 $lastCondition  LIMIT 2 OFFSET $offset"; //echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
                $tempArray = $row;
                $row->category=fetch_experiences_categories($con,$row->expid);
                $row->user=fetchUserByUserid($con,$row->userid);
                $row->comments=fetchCommentByPostid($con,$row->expid);
                $row->likes=fetchLikesByPostid($con,$row->expid);
                $row->saves=fetchSavesByPostid($con,$row->expid);
                
                array_push($resultArray, $row);
        }
    }
return $resultArray;

}
function fetch_experiences_by_public($con,$offset,$groupId,$typeOfPost,$userEmail){
    $resultArray = array();
    $tempArray = array();
    if(strcmp($groupId,"all")==0)  $addSql=" "; else $addSql=" groupid=$groupId ";
    if(strcmp($typeOfPost,"all")==0)  $addSqlTypeExp=" "; else $addSqlTypeExp=" typeofpost='$typeOfPost' ";
    if((strcmp($typeOfPost,"all")!=0)||(strcmp($groupId,"all")!=0))  $where=" where ";
    if((strcmp($typeOfPost,"all")!=0)&&(strcmp($groupId,"all")!=0))  $and=" and ";
    
    $lastCondition=$where.$addSql.$and.$addSqlTypeExp;
    $sql = "SELECT * FROM exp $lastCondition LIMIT 2 OFFSET $offset"; // echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	){
        while($row = $result->fetch_object()){
                $tempArray = $row;
                $row->category=fetch_experiences_categories($con,$row->id);
                $row->user=fetchUserByUserid($con,$row->userid);
                $row->comments=fetchCommentByPostid($con,$row->id);
                $row->likes=fetchLikesByPostid($con,$row->id);
                $row->saves=fetchSavesByPostid($con,$row->id);
                
                //$row->content='';
                $row->numLikes= count($row->likes);
                array_push($resultArray, $row);
        }
    }
    return $resultArray;
}


function fetch_experiences($con){
    $offset=$_GET['offset'];
    $groupId=$_GET['groupId'];
    $seed=$_GET['seed'];
    $typeOfPost=$_GET['typeOfPost'];
    $userEmail=$_GET['userEmail'];
    $sort=$_GET['sort'];
     if(strcmp($seed,'public')!=0){
        if(strcmp($userEmail,'undefined')!=0)
            $result=fetch_experiences_by_interresting_cats($con,$offset,$groupId,$typeOfPost,$userEmail);//var_dump($arrayInterrestedPosts);
    }
    else{
            $result=fetch_experiences_by_public($con,$offset,$groupId,$typeOfPost,$userEmail);//var_dump($arrayInterrestedPosts);    
    }
    
    if(strcmp($sort,'new')==0){
      usort($result, "cmp");
    }else if(strcmp($sort,'like')==0)
      usort($result, "likeCmp");
           
    $t=json_encode($result);
    if(strlen($t)!=2)   echo $t;
}







function likeCmp($object1, $object2) {
    return (int)($object1->numLikes) < (int)($object2->numLikes);
}

function cmp($object1, $object2) {
    return (int)($object1->id) < (int)($object2->id);
}

function notInserted($row,$source){
        for($i=count($source)-1;$i>=0;$i--){
            if($source[$i]->id==$row->id) return true;
        }
        return false;
}

function fetchUserByUserEmail($con,$email){
    $sql = "SELECT * FROM user where email='$email'";//echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	)
      $row = $result->fetch_object();
    return $row;
}

function fetchUserByUserid($con,$uid){
    $sql = "SELECT * FROM user where id=$uid";//echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	)
      $row = $result->fetch_object();
    return $row;
}

function fetchCommentByPostid($con,$postid){
    $comment= array();
    $sql = "SELECT * FROM comment where expid=$postid";//echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	)
      while($row = $result->fetch_object()){
          $row->user=fetchUserByUserid($con,$row->userid);
           array_push($comment, $row);
      }
    return $comment;
}

function fetchLikesByPostid($con,$postid){
    $likes= array();
    $sql = "SELECT * FROM likes where expid=$postid";//echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	)
      while($row = $result->fetch_object()){
           array_push($likes, $row);
      }
    return $likes;
}
function fetchSavesByPostid($con,$postid){
    $likes= array();$likes=[];
    $sql = "SELECT * FROM saves where expid=$postid";//echo $sql;
    if ($result=$con->QUERY_RUN($con,$sql)	)
      while($row = $result->fetch_object()){
           array_push($likes, $row);
      }
    return $likes;
}

?>