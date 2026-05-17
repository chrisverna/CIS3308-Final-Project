package dbUtils;

public class PrepStatement {

    private java.sql.PreparedStatement ps = null;
    private String sql = "";
    private String errorMsg = "";

    public PrepStatement(DbConn dbc, String sql) {
        this.sql = sql;
        try {
            java.sql.Connection con = dbc.getConn();
            this.ps = con.prepareStatement(sql);
        } catch (Exception e) {
            String msg = " PrepStatement: Exception in constructor. Sql is " + this.sql + " Error message is "
                    + e.getMessage();
            System.out.println("====> " + msg);
            this.errorMsg += msg;
        }
    }

    public String getErrorMsg() {
        return this.errorMsg;
    }

    public String setDate(int position, java.sql.Date newDate) {
        try {
            if (newDate == null) {
                ps.setNull(position, java.sql.Types.DATE);
            } else {
                this.ps.setDate(position, newDate);
            }
            return "";
        } catch (Exception e) {
            String msg = " PrepStatement: Exception in setDate(). Sql is " + this.sql
                    + ", position: " + position + ". Error Msg: " + e.getMessage();
            System.out.println("====> " + msg);
            this.errorMsg += msg;
            return msg;
        }
    }

    public String setInt(int position, Integer newInt) {
        try {
            if (newInt == null) {
                ps.setNull(position, java.sql.Types.INTEGER);
            } else {
                this.ps.setInt(position, newInt);
            }
            return "";
        } catch (Exception e) {
            String msg = " PrepStatement: Exception in setInt(). Sql is " + this.sql
                    + ", position: " + position + ". Error Msg: " + e.getMessage();
            System.out.println("====> " + msg);
            this.errorMsg += msg;
            return msg;
        }
    }

    public String setBigDecimal(int position, java.math.BigDecimal newBigDecimal) {
        try {
            if (newBigDecimal == null) {
                ps.setNull(position, java.sql.Types.DECIMAL);
            } else {
                this.ps.setBigDecimal(position, newBigDecimal);
            }
            return "";
        } catch (Exception e) {
            String msg = " PrepStatement: Exception in setBigDec(). Sql is " + this.sql
                    + ", position: " + position + ". Error Msg: " + e.getMessage();
            System.out.println("====> " + msg);
            this.errorMsg += msg;
            return msg;
        }
    }

    public String setString(int position, String newString) {
        try {
            if (newString == null) {
                newString = "";
            }
            this.ps.setString(position, newString);
            return "";
        } catch (Exception e) {
            String msg = " PrepStatement: Exception in setString(). Sql is " + this.sql
                    + ", position: " + position + ". Error Msg: " + e.getMessage();
            System.out.println("====> " + msg);
            this.errorMsg += msg;
            return msg;
        }
    }

    public int executeUpdate() {
        try {
            int numRows = this.ps.executeUpdate();
            return numRows;
        } catch (Exception e) {
            String msg = " PrepStatement: Exception in executeUpdate(). Sql is " + this.sql
                    + ". Error Msg: " + e.getMessage();
            System.out.println("====> " + msg);
            this.errorMsg += msg;
            return -1;
        }
    }
}