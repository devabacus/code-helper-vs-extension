export const build_yaml = `
targets:
  $default:
    builders:
      drift_dev:
        options:
          databases:
            # Замените my_database на подходящее имя и укажите правильный путь к вашему файлу базы данных
            my_database: lib/core/database/database.dart            
`;