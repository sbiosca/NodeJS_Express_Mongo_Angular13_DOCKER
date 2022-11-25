FILE="/db-dump/*.json"

for f in $FILE;
do
    mongoimport -d bd_projects --jsonArray --file $f;
done
#mongoimport --db bd_projects --collection categories --file /db-dump/categories.json --jsonArray
