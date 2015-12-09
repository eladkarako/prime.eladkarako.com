<?php
  header('Content-Type:application/javascript; charset=UTF-8');
  $min = $max = 100;
  
  $files = [];
  clearstatcache(true);
  $handle = @opendir('./json/');
  while ($file = @readdir($handle)){
    if("." === $file || ".." === $file) continue;

    $a = intval(explode('-',$file)[0]);
    $b = intval(str_replace('.json', '', explode('-',$file)[1]));

    array_push($files, $a);
    array_push($files, $b);
    array_push($files, $file);

    $min = min($min, $a,$b);
    $max = max($max,$a,$b);
  }
  @closedir($handle);
  $files = json_encode($files, JSON_NUMERIC_CHECK );
/*
window.range_min = <?php echo $min; ?>;

window.range_max = <?php echo $max; ?>;
*/
?>window.jsons = <?php echo $files; ?>;
window.jsons_range_min = <?php echo $min; ?>;
window.jsons_range_max = <?php echo $max; ?>;

