#[nd]get online employees
SELECT DISTINCT(a.`user_id`), u.username FROM `oc_user_activity` as a LEFT JOIN oc_user as u ON a.user_id = u.user_id WHERE 1 and u.user_role = 'picking' and `logout` is null;

#get last four's stocking reports x
SELECT CONCAT(u.firstname, ' ', u.lastname) as name, COUNT(s.id) as total FROM `oc_user_stock_history` AS s INNER JOIN oc_user as u ON s.user_id = u.user_id  WHERE s.user_id IN(SELECT user_id from oc_user_activity WHERE logout is null) and `stock_time` > (NOW() - INTERVAL 240 MINUTE) GROUP BY s.user_id ORDER BY total ASC;

#get total orders x
SELECT COUNT(*) AS total FROM oc_order WHERE order_status_id > '0';

#get total customers x
SELECT COUNT(*) AS total FROM oc_customer;

#get people online x
SELECT count(*) FROM oc_customer_online co LEFT JOIN oc_customer c ON (co.customer_id = c.customer_id);

#[nd]get average sale per order 
SELECT order_id FROM oc_order where total>0;


#get unique users x
SELECT COUNT( DISTINCT(ip_address)) as ttl from oc_user_truck;

#get unique transactions x
SELECT COUNT(DISTINCT(customer_id)) as ttl from  oc_order;

#get total revenue x
SELECT sum(total) as ttl  from oc_order;

#get recent activity x
SELECT a.key, a.data, a.date_added FROM ((SELECT CONCAT('customer_', ca.key) AS `key`, ca.data, ca.date_added FROM oc_customer_activity ca) UNION (SELECT CONCAT('affiliate_', aa.key) AS `key`, aa.data, aa.date_added FROM oc_affiliate_activity aa)) a ORDER BY a.date_added DESC LIMIT 0,5;


#get most items sold x
SELECT op.product_id, op.name, op.model, count(op.product_id) as cnt, p.image from oc_order_product as op INNER JOIN oc_product as p ON op.product_id = p.product_id group by op.product_id order by count(op.product_id) desc limit 50;

#get most available items x
select p.product_id, pd.name, p.model, p.quantity, p.image from oc_product as p INNER JOIN oc_product_description as pd ON p.product_id = pd.product_id  order by p.quantity desc limit 50;

#get top product revenue x
select op.product_id, op.name, op.model, count(op.product_id) as cnt, sum(p.price) as revenue, p.image from oc_order_product as op INNER JOIN oc_product as p ON op.product_id = p.product_id group by op.product_id order by revenue desc limit 50;


#get top category revenue x
select DISTINCT(cd.category_id) as cid,  cd.name as category_name, sum(p.price) as revenue, cd.description as category_description  from oc_order_product as op INNER JOIN oc_product as p ON op.product_id = p.product_id LEFT JOIN oc_product_to_category as c ON p.product_id = c.product_id LEFT JOIN oc_category_description as cd ON c.category_id = cd.category_id group by cd.category_id order by revenue desc limit 50;

#get most returned items x
select p.product_id, op.model, count(op.model) as cnt, p.image, d.name from oc_return as op INNER JOIN oc_product as p ON op.model = p.model INNER JOIN oc_product_description as d ON p.product_id = d.product_id  group by op.model order by count(op.model) desc limit 50;

#get most returned users x
select op.firstname, op.customer_id, op.lastname, count(op.customer_id) as cnt, op.email, op.telephone from oc_return as op   group by op.customer_id order by count(op.customer_id) desc limit 50;

#get most notify me items x
SELECT count(n.product_id) as cnt, p.* FROM oc_out_of_stock_notify as n INNER JOIN oc_product as p ON n.product_id = p.product_id group by p.product_id order by count(n.product_id) DESC limit 50;

#get top stoker x
SELECT count(p.barcode_user_id) as cnt, p.barcode_user_id as user_id, c.firstname, c.lastname, c.email, c.phone  FROM oc_product as p INNER JOIN oc_user as c ON p.barcode_user_id = c.user_id group by p.barcode_user_id order by count(p.barcode_user_id) DESC limit 50;

#get top picker x
SELECT count(p.assinged_to) as cnt, p.assinged_to as user_id, c.firstname, c.lastname, c.email, c.phone  FROM oc_order_pickuptime as p INNER JOIN oc_user as c ON p.assinged_to = c.user_id where p.type = 'pickup' and p.status = '2' group by p.assinged_to order by count(p.assinged_to) DESC limit 50;

#get top haular x
SELECT count(p.assinged_to) as cnt, c.firstname, p.assinged_to as user_id, c.lastname, c.email, c.phone  FROM oc_order_pickuptime as p INNER JOIN oc_user as c ON p.assinged_to = c.user_id where p.type = 'delivery' and p.status = '2' group by p.assinged_to order by count(p.assinged_to) DESC limit 50;

