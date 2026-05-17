package dbUtils;

public class Validate {

    public static String dateMsg(String val, boolean required) {

        if (val == null) {
            return "Validate.dateMsg(): Programmer error - should not be trying to validate null.";
        }
        if ((val.length() == 0) && !required) {
            return "";
        }
        try {
            java.text.SimpleDateFormat dateformat = new java.text.SimpleDateFormat("MM/dd/yyyy");
            dateformat.setLenient(false);
            java.util.Date myDate = dateformat.parse(val);
            java.sql.Date convertedDate = new java.sql.Date(myDate.getTime());
            return "";
        } catch (Exception e) {
            return "Please enter a valid date (MM/DD/YYYY)";
        }
    }

    public static java.sql.Date convertDate(String val) {

        if ((val == null) || (val.length() == 0)) {
            return null;
        }
        try {
            java.text.SimpleDateFormat dateformat = new java.text.SimpleDateFormat("MM/dd/yyyy");
            dateformat.setLenient(false);
            java.util.Date myDate = dateformat.parse(val);
            return new java.sql.Date(myDate.getTime());
        } catch (Exception e) {
            System.out.println("Validate.convertDate(): cannot convert " + val + " to date.");
            return null;
        }
    }

    public static String decimalMsg(String val, boolean required) {

        if (val == null) {
            return "Validate.decimalMsg(): Programmer error - should not be trying to validate null.";
        }
        if ((val.length() == 0) && !required) {
            return "";
        }
        val = val.replace("$", "");
        val = val.replace(",", "");
        try {
            java.math.BigDecimal convertedDecimal = new java.math.BigDecimal(val);
            return "";
        } catch (Exception e) {
            return "Please enter a dollar amount";
        }
    }

    public static java.math.BigDecimal convertDecimal(String val) {

        if ((val == null) || (val.length() == 0)) {
            return null;
        }
        val = val.replace("$", "");
        val = val.replace(",", "");
        try {
            return new java.math.BigDecimal(val);
        } catch (Exception e) {
            System.out.println("Validate.convertDecimal(): cannot convert " + val + " to java.math.BigDecimal.");
            return null;
        }
    }

    public static String integerMsg(String val, boolean required) {
        if (val == null) {
            return "Validate.integerMsg(): Programmer error - should not be trying to validate null.";
        }
        if ((val.length() == 0) && !required) {
            return "";
        }
        try {
            Integer convertedInteger = Integer.valueOf(val);
            return "";
        } catch (Exception e) {
            return "Please enter an integer";
        }
    }

    public static Integer convertInteger(String val) {

        if ((val == null) || (val.length() == 0)) {
            return null;
        }
        try {
            return Integer.valueOf(val);
        } catch (Exception e) {
            System.out.println("Validate.convertInteger(): cannot convert " + val + " to Integer.");
            return null;
        }
    }

    public static String stringMsg(String val, int maxlen, boolean required) {

        if (val == null) {
            return "Validate.stringMsg(): Programmer error - should not be trying to validate null.";
        }
        if (val.length() == 0) {
            if (required) {
                return "Input is required";
            } else {
                return "";
            }
        }

        if (val.length() > maxlen) {
            return "Please shorten to [" + val.substring(0, maxlen) + "]";
        } else {
            return "";
        }
    }
}