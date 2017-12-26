/*
 * The MIT License
 *
 * Copyright 2017 admin.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package servlets;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import javax.persistence.EntityManagerFactory;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Configuration;
import model.ConfigurationJpaController;
import model.Encriptacion;
import model.User;
import model.UserJpaController;

/**
 *
 * @author admin
 */
@WebServlet(name = "CreateConfigurationUser", urlPatterns = {"/CreateConfigurationUser"})
public class CreateConfigurationUser extends HttpServlet {

    /**
     * Add a configuration in User.
     *
     * @param request userName, configname, diffId, rocketId, planetId.
     * @param response In all cases a JSON is returned with the result.
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            EntityManagerFactory emf = (EntityManagerFactory) getServletContext().getAttribute("emf");
            UserJpaController uc = new UserJpaController(emf);
            ConfigurationJpaController cc = new ConfigurationJpaController(emf);
            User u = uc.findUserByUsername(request.getParameter("userName"));
            if (u == null) {
                Map<String, String> emess = new HashMap<>();
                emess.put("error", "User not found");

                Gson gson = new GsonBuilder().create();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.setContentType("application/json");
                PrintWriter pw = response.getWriter();
                pw.println(gson.toJson(emess));
            } else {
                if (!cc.existByConfigName(request.getParameter("configname"), u)) {

                    Configuration conf = new Configuration();
                    conf.setConfigname(request.getParameter("configname"));
                    conf.setDiffId(Integer.parseInt(request.getParameter("diffId")));
                    conf.setRocketId(Integer.parseInt(request.getParameter("rocketId")));
                    conf.setPlanetId(Integer.parseInt(request.getParameter("planetId")));
                    conf.setUserId(u);
                    cc.create(conf);

                    Map<String, String> mess = new HashMap<>();
                    mess.put("mess", "Configuration added");

                    Gson gson = new GsonBuilder().create();

                    response.setContentType("application/json");
                    PrintWriter pw = response.getWriter();
                    pw.println(gson.toJson(mess));
                } else {
                    Map<String, String> emess = new HashMap<>();
                    emess.put("error", "Configuration name already exists");

                    Gson gson = new GsonBuilder().create();
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.setContentType("application/json");
                    PrintWriter pw = response.getWriter();
                    pw.println(gson.toJson(emess));
                }
            }

        } catch (Exception e) {
            Map<String, String> emess = new HashMap<>();
            emess.put("error", "Server error");

            Gson gson = new GsonBuilder().create();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            PrintWriter pw = response.getWriter();
            pw.println(gson.toJson(emess));

        }
    }

}
