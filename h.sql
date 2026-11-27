SELECT 
    b.fornavn,
    b.etternavn,
    y.by_navn,
    y.borgermester
FROM bruker b
JOIN by y ON b.by_id = y.by_id;