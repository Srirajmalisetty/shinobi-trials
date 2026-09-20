package com.app.quizsystem.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.hikari")
    public DataSource dataSource(DataSourceProperties properties) {
        String url = properties.getUrl();
        String username = properties.getUsername();
        String password = properties.getPassword();

        // Support Render's standard DATABASE_URL environment variable
        String envDbUrl = System.getenv("DATABASE_URL");
        if (StringUtils.hasText(envDbUrl)) {
            url = envDbUrl;
        }

        if (StringUtils.hasText(url) && (url.startsWith("postgres://") || url.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(url.replace("postgres://", "postgresql://"));
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                url = "jdbc:postgresql://" + host + ":" + port + path;

                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":");
                    username = userInfo[0];
                    if (userInfo.length > 1) {
                        password = userInfo[1];
                    }
                }
            } catch (Exception ignored) {
                // fallback to original url
            }
        }

        if (StringUtils.hasText(url) && !url.startsWith("jdbc:")) {
            url = "jdbc:" + url;
        }

        HikariDataSource dataSource = properties.initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();

        if (StringUtils.hasText(url)) {
            dataSource.setJdbcUrl(url);
        }
        if (StringUtils.hasText(username)) {
            dataSource.setUsername(username);
        }
        if (StringUtils.hasText(password)) {
            dataSource.setPassword(password);
        }

        return dataSource;
    }
}
