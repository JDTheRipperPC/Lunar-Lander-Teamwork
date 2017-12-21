<%-- 
    Document   : game
    Created on : 21-dic-2017, 17:43:02
    Author     : admin
--%>

<%@page import="model.User"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%User user = (User) request.getAttribute("User"); %>

<%
    if (user == null) {
        response.sendRedirect("login.html");
    }
%>

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <h1>THIS IS GAME JSP</h1>
    </body>
</html>
