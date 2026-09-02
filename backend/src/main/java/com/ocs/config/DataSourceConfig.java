package com.ocs.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    public DataSource dataSource(Environment env) {
        String mysqlUrl = env.getProperty("MYSQL_URL");
        if (mysqlUrl == null || mysqlUrl.trim().isEmpty()) {
            mysqlUrl = env.getProperty("DATABASE_URL");
        }

        String jdbcUrl;
        String username;
        String password;

        if (mysqlUrl != null && !mysqlUrl.trim().isEmpty() && mysqlUrl.startsWith("mysql://")) {
            try {
                URI uri = new URI(mysqlUrl);
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 3306 : uri.getPort();
                String path = uri.getPath();
                String database = (path != null && path.length() > 1) ? path.substring(1) : "railway";
                
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts[1];
                } else {
                    username = userInfo != null ? userInfo : "root";
                    password = "";
                }

                jdbcUrl = "jdbc:mysql://" + host + ":" + port + "/" + database + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
                System.out.println("=================================================");
                System.out.println(" Initialized DataSource from MYSQL_URL / DATABASE_URL");
                System.out.println(" Target Host: " + host + ":" + port);
                System.out.println(" Target Database: " + database);
                System.out.println(" Database User: " + username);
                System.out.println("=================================================");
            } catch (Exception e) {
                System.err.println(">>> Failed to parse MYSQL_URL, falling back to standard properties: " + e.getMessage());
                jdbcUrl = buildJdbcUrl(env);
                username = getUsername(env);
                password = getPassword(env);
            }
        } else {
            jdbcUrl = buildJdbcUrl(env);
            username = getUsername(env);
            password = getPassword(env);
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        return new HikariDataSource(config);
    }

    private String buildJdbcUrl(Environment env) {
        String host = env.getProperty("MYSQLHOST");
        if (host == null || host.trim().isEmpty()) {
            host = env.getProperty("DB_HOST", "localhost");
        }

        String port = env.getProperty("MYSQLPORT");
        if (port == null || port.trim().isEmpty()) {
            port = env.getProperty("DB_PORT", "3306");
        }

        String database = env.getProperty("MYSQLDATABASE");
        if (database == null || database.trim().isEmpty()) {
            database = env.getProperty("DB_NAME", "ocs_db");
        }

        String url = "jdbc:mysql://" + host + ":" + port + "/" + database + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        System.out.println("=================================================");
        System.out.println(" Initialized DataSource from Environment Variables");
        System.out.println(" Target Host: " + host + ":" + port);
        System.out.println(" Target Database: " + database);
        System.out.println(" Database User: " + getUsername(env));
        System.out.println("=================================================");
        return url;
    }

    private String getUsername(Environment env) {
        String user = env.getProperty("MYSQLUSER");
        if (user == null || user.trim().isEmpty()) {
            user = env.getProperty("DB_USERNAME", "root");
        }
        return user;
    }

    private String getPassword(Environment env) {
        String pass = env.getProperty("MYSQLPASSWORD");
        if (pass == null) {
            pass = env.getProperty("DB_PASSWORD", "");
        }
        return pass;
    }
}
