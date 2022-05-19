
###################################################################################

#Models

###################################################################################
Order

    -Order ID (Pk) - varchar 16
    -Order Date
    -Ordered By (FK) - varchar 16
    -Total Amount
    -Discount
    -Coupon - varchar 20
    -Order Status - varchar 4
    -Delivery Date
    -Delivered Date
    -Address ID(FK) - varchar 16
    -Products [id1, id2, id3]

-----------------------------------------------------------------------------------
Customer(Ordered By)

    - Customer ID (PK   )- varchar 16
    -Customer Name - varchar 128
    -DOB
    -Registered On
    -Mobile Number - varchar 10
    -Mobile Number Verified
    -Email - varchar 64
    -Email Verified
    
-----------------------------------------------------------------------------------
Customer Address
    - Address ID (PK ) - varchar 16
    -Flat, Apartment - Varchar 24
    -Street - Varchar 24
    -Area - Varchar 24
    -City - 

-----------------------------------------------------------------------------------
Product


-----------------------------------------------------------------------------------


