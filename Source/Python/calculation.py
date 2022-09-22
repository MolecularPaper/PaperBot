import sys, io

operators = ['+', '-', '*', '/', '^','(', ')', '.']

def calculation(text):
    if not operator_check(text) or not bracket_check(text):
        print("계산식이 유효하지 않습니다.")
        return
    
    try:
        result = parse(text)
    except Exception as e:
        print(f"에러: {e}")
        return

    print(f'결과: {result}')

# 괄호 유효성 체크
def bracket_check(text: str) -> bool:
    check_count = 0

    for char in list(text):
        check_count += 1 if char == "(" else -1 if char == ")" else 0
    
    return check_count == 0

# 오퍼레이터 유효성 체크
def operator_check(text: str) -> bool():
    for char in list(text):
        if not (operators.__contains__(char) or char.isdecimal()):
            return False
    return True

def parse(text):
    expr = transformExpr(text)
    stack = []

    for oper in expr:
        try:
            stack.append(float(oper))
            continue
        except ValueError:
            a = stack.pop(0)
            b = stack.pop(0)
        print(f">>> {a} {oper} {b}")
        
        if oper == '+':
            stack.insert(0, a + b)
        elif oper == '-':
            stack.insert(0, a - b)
        elif oper == '*':
            stack.insert(0, a * b)
        elif oper == '/':
            stack.insert(0, a / b)
        elif oper == '^':
            stack.insert(0, pow(a, b))
        else:
            raise Exception('계산도중 오류가 발생하였습니다.')
    
    return stack[0]

def transformExpr(text: str):
    op = [] #연산자들을 담아두는 stack
    exrp = []
    temp = ''
    for ch in text:
        if not ch.isdigit() and ch != '.' and temp != '':
            exrp.append(temp)
            temp = ''

        if ch == '(': #여는 괄호가 나올 경우 다음 글자로 진행합니다.
            continue
        elif ch.isdigit() or ch == '.': #피연산자가 등장하면 그대로 결과 표현에 붙여줍니다.
            temp += ch
        elif ch == ')': #닫는 괄호가 나올 경우 표현이 끝난 것이므로 마지막으로 stack에 넣어놨던 연산자를 빼서 붙여줍니다.
            exrp.append(op.pop())
        else: #연산자가 등장할 경우 stack에 넣어줍니다.
            op.append(ch)
    
    if temp != "":
        exrp.append(temp)
    
    for ch in op:
        exrp.append(ch)
    
    return exrp

def pow(a, b):
    result = 1
    for x in range(int(b)):
        result * a
    return result

if __name__ == "__main__":
    sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = 'utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding = 'utf-8')
    calculation(sys.argv[1])