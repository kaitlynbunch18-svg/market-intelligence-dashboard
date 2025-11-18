import psycopg2  
  
DATABASE_URL = "postgresql://postgres:NJVFZHdNFHMXZTvhQNGOuutGtgsjLCxJ@maglev.proxy.rlwy.net:15023/railway"  
  
conn = psycopg2.connect(DATABASE_URL)  
cur = conn.cursor()  
  
print("Clearing mi_opportunities table...")  
cur.execute("DELETE FROM mi_opportunities")  
conn.commit()  
print("Done!")  
cur.close()  
conn.close() 
