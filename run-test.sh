docker-compose up -d influxdb grafana
docker-compose run k6 run /test/stress.test.js

echo "--------------------------------------------------------------------------------------"
echo "Load testing with Grafana dashboard http://localhost:3000/d/k6/k6-load-testing-results"
echo "--------------------------------------------------------------------------------------"
