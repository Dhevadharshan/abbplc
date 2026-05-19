VAR
    Pump_P101 : BOOL;
    Tank_Level : REAL;
    High_Level_Limit : REAL := 90.0;
    Low_Level_Limit : REAL := 20.0;
    Emergency_Stop : BOOL;
    System_Healthy : BOOL;
END_VAR

(* Main Control Logic *)
IF NOT Emergency_Stop AND System_Healthy THEN
    IF Tank_Level < Low_Level_Limit THEN
        Pump_P101 := TRUE;
    ELSIF Tank_Level > High_Level_Limit THEN
        Pump_P101 := FALSE;
    END_IF;
ELSE
    Pump_P101 := FALSE;
END_IF;
