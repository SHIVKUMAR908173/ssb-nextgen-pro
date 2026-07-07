import os, glob, re

files = glob.glob('app/api/endpoints/*.py')
for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # 1. Fix exception leakage
    content = re.sub(r'raise HTTPException\(status_code=500, detail=str\(e\)\)', 
                     r'import logging\n        logging.error(f"Internal Error: {str(e)}")\n        raise HTTPException(status_code=500, detail="Internal Server Error")', 
                     content)
    
    with open(f, 'w') as file:
        file.write(content)
print('Patched exceptions.')
