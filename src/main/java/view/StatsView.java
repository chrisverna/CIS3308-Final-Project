package view;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import model.stats.*;
import dbUtils.*;

public class StatsView {

    public static StringDataList getAllStats(DbConn dbc) {

        // sdl will be an empty array and DbError with "" 
        StringDataList sdl = new StringDataList(); 

        sdl.dbError = dbc.getErr(); // returns "" if connection is good, else db error msg.
        if (sdl.dbError.length() > 0) {
            return sdl; // cannot proceed, db error (and that's been recorded in return object).
        }
        
        // sd will have all of it's fields initialized to ""
        StringData sd = new StringData();
        
        try {
            String sql = "SELECT s.stats_id, s.player_name, s.image, s.total_tackles, "
                    + "s.solo_tackles, s.interceptions, s.sacks, s.tackles_for_loss, "
                    + "s.accolades, s.web_user_id, wu.user_email "
                    + "FROM stats s "
                    + "LEFT JOIN web_user wu ON s.web_user_id = wu.web_user_id "
                    + "ORDER BY s.stats_id";
            
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();

            while (results.next()) {
                
                sd = new StringData();
                
                // the Format methods do not throw exceptions. If they find illegal data (like you 
                // tried to format a date as an integer), they return an error message (instead of 
                // returning the formatted value). So, you'll see these error messages right in the 
                // API output (JSON data) and/or you'll see it on the page in the UI.




                sd.stats_id = Format.fmtInteger(results.getObject("stats_id"));
                sd.player_name = Format.fmtString(results.getObject("player_name"));
                sd.image = Format.fmtString(results.getObject("image"));
                sd.total_tackles = Format.fmtInteger(results.getObject("total_tackles"));
                sd.solo_tackles = Format.fmtInteger(results.getObject("solo_tackles"));
                sd.interceptions = Format.fmtInteger(results.getObject("interceptions"));
                sd.sacks = Format.fmtDecimal(results.getObject("sacks"));
                sd.tackles_for_loss = Format.fmtInteger(results.getObject("tackles_for_loss"));
                sd.accolades = Format.fmtString(results.getObject("accolades"));

                sd.web_user_id = Format.fmtInteger(results.getObject("web_user_id"));
                sd.user_email = Format.fmtString(results.getObject("user_email"));






                sdl.add(sd);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in WebUserView.getAllUsers(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
}
